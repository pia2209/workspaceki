import Anthropic from "@anthropic-ai/sdk";
import { redactPii } from "./privacy";
import type { KnowledgeItem } from "./types";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-8";
const PII_REDACTION_ENABLED = process.env.PII_REDACTION_ENABLED !== "false";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

const SYSTEM_PROMPT = `Du bist der KI-Assistent einer Anwaltskanzlei im adaptiven Kanzlei-Workspace. Deine Aufgabe ist es, aus Recherchenotizen, Besprechungsprotokollen, früheren Arbeitsergebnissen (Schriftsätze, Verträge, Gutachten) und Mandanten-/Stakeholder-Signalen eines Mandats entscheidungsreife Analysen und Dokumente zu erstellen.

Regeln:
- Stütze dich ausschließlich auf den bereitgestellten Wissensbestand ("Mandatswissen") unten. Erfinde keine Fakten, Rechtsprechung, Daten oder Zusagen, die dort nicht enthalten sind.
- Wenn rechtliche Informationen fehlen oder widersprüchlich sind, benenne das explizit, anstatt zu spekulieren. Bei rechtlichen Fragestellungen weise auf offene Punkte hin, die noch recherchiert werden sollten.
- Referenziere Quellen mit Titel und Datum, wenn du dich auf ein bestimmtes Element im Mandatswissen beziehst.
- Antworte standardmäßig auf Deutsch, außer die Anfrage ist klar in einer anderen Sprache formuliert.
- Manche personenbezogenen Daten wurden aus Datenschutzgründen bereits automatisch geschwärzt (z.B. "[REDACTED_EMAIL]"). Behandle das als normalen Platzhalter, weise aber nicht unnötig darauf hin.
- Sei präzise und entscheidungsorientiert: Partner und Mandanten sollen aus deiner Antwort direkt den Status verstehen oder eine fundierte Entscheidung treffen können.
- Beachte die anwaltliche Sorgfaltspflicht: Kennzeichne Unsicherheiten deutlich und unterscheide zwischen gesicherten Fakten und eigenen Einschätzungen.`;

export interface KbBuildResult {
  block: string;
  redactionApplied: boolean;
  itemIds: string[];
}

/** Renders knowledge items into a single text block, applying PII redaction per item's flag. */
export function buildKnowledgeBaseBlock(items: KnowledgeItem[]): KbBuildResult {
  let redactionApplied = false;
  const rendered = items.map((item) => {
    let content = item.content;
    if (PII_REDACTION_ENABLED && item.pii_redact) {
      const before = content;
      content = redactPii(content);
      if (content !== before) redactionApplied = true;
    }
    return [
      `--- [${item.type.toUpperCase()}] ${item.title} (${item.occurred_at.slice(0, 10)}, Quelle: ${item.source || "unbekannt"}) ---`,
      content,
    ].join("\n");
  });
  return {
    block: rendered.join("\n\n"),
    redactionApplied,
    itemIds: items.map((i) => i.id),
  };
}

function buildKbMessageBlock(kb: KbBuildResult): Anthropic.TextBlockParam {
  return {
    type: "text",
    text: `Mandatswissen (Recherche, Besprechungen, Arbeitsergebnisse, Mandanten-Signale):\n\n${kb.block || "(noch keine Einträge vorhanden)"}`,
    cache_control: { type: "ephemeral" },
  };
}

async function complete(kb: KbBuildResult, task: string, maxTokens: number, effort: "low" | "medium" | "high" = "medium"): Promise<string> {
  const response = await getClient().messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    thinking: { type: "adaptive" },
    output_config: { effort },
    messages: [
      {
        role: "user",
        content: [buildKbMessageBlock(kb), { type: "text", text: task }],
      },
    ],
  });
  const text = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
  return text?.text ?? "";
}

export async function generateProjectStatusSummary(kb: KbBuildResult, projectName: string) {
  const task = `Erstelle eine kompakte Status-Zusammenfassung für das Mandat "${projectName}" auf Basis des Mandatswissens oben. Gib zurück:
1. Eine Zeile "STATUS: on_track" ODER "STATUS: at_risk" ODER "STATUS: blocked" (genau einer dieser drei Werte, nichts anderes in dieser Zeile).
   - on_track: Mandat verläuft planmäßig, keine offenen kritischen Punkte
   - at_risk: Es gibt Aspekte, die Aufmerksamkeit erfordern (Fristen, offene Rechtsfragen, Mandantenbedenken)
   - blocked: Kritische Blocker, die eine Fortführung verhindern (fehlende Informationen, ausstehende Entscheidungen)
2. Danach 3-6 Sätze: aktueller Verfahrensstand, letzte wichtige Entwicklungen, offene Rechtsfragen oder Risiken, nächste anstehende Schritte.
Nutze KEINE Überschriften außer der STATUS-Zeile.`;
  const text = await complete(kb, task, 1024, "medium");
  const match = text.match(/STATUS:\s*(on_track|at_risk|blocked)/i);
  const health = (match?.[1]?.toLowerCase() ?? "on_track") as "on_track" | "at_risk" | "blocked";
  const summary = text.replace(/STATUS:\s*(on_track|at_risk|blocked)\s*/i, "").trim();
  return { summary, health };
}

export async function generateDeliverable(kb: KbBuildResult, instructions: string): Promise<string> {
  const task = `Erstelle auf Basis des Mandatswissens oben ein entscheidungsreifes Dokument gemäß folgender Anweisung:\n\n${instructions}\n\nFormatiere das Ergebnis in Markdown mit klaren Abschnitten. Bei rechtlichen Fragestellungen strukturiere nach: Sachverhalt, Rechtslage, Bewertung/Risiken, Handlungsempfehlung. Kennzeichne Unsicherheiten oder offene Punkte deutlich.`;
  return complete(kb, task, 8000, "high");
}

export async function askProjectQuestion(kb: KbBuildResult, question: string): Promise<string> {
  const task = `Beantworte folgende Frage ausschließlich auf Basis des Mandatswissens oben:\n\n${question}\n\nWenn die Antwort nicht aus dem Mandatswissen hervorgeht, sage das explizit und nenne ggf. welche Informationen noch benötigt werden.`;
  return complete(kb, task, 2048, "medium");
}

export function isPiiRedactionEnabled(): boolean {
  return PII_REDACTION_ENABLED;
}

export function currentModel(): string {
  return MODEL;
}
