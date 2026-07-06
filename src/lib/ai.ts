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

const SYSTEM_PROMPT = `Du bist der KI-Assistent eines adaptiven Kanzlei-Workspace. Deine Aufgabe ist es, aus Research-Notizen, Meeting-Protokollen, früheren Arbeitsergebnissen (Deliverables wie Gutachten, Schriftsätze oder Memos) und Stakeholder-Signalen (Mandant, Gegenseite, Gericht) eines Mandats entscheidungsreife Antworten und Dokumente für Partner:innen zu erstellen.

Regeln:
- Stütze dich ausschließlich auf den bereitgestellten Wissensbestand ("Mandatswissen") unten. Erfinde keine Fakten, Zahlen, Namen, Fristen oder Zusagen, die dort nicht enthalten sind.
- Wenn Informationen fehlen oder widersprüchlich sind, benenne das explizit, anstatt zu spekulieren.
- Referenziere Quellen mit Titel und Datum, wenn du dich auf ein bestimmtes Element im Mandatswissen beziehst.
- Antworte standardmäßig auf Deutsch, außer die Anfrage ist klar in einer anderen Sprache formuliert.
- Manche personenbezogenen Daten wurden aus Datenschutzgründen bereits automatisch geschwärzt (z.B. "[REDACTED_EMAIL]"). Behandle das als normalen Platzhalter, weise aber nicht unnötig darauf hin.
- Sei präzise und entscheidungsorientiert: Ein Partner soll aus deiner Antwort direkt den Stand des Mandats verstehen oder eine Entscheidung treffen können.
- Dies ist keine eigenständige Rechtsberatung, sondern eine Zusammenfassungs- und Entwurfshilfe auf Basis der von der Kanzlei bereits erarbeiteten Inhalte.`;

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
    text: `Mandatswissen (Research, Meetings, Deliverables, Stakeholder-Signale):\n\n${kb.block || "(noch keine Einträge vorhanden)"}`,
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

export async function generateMandateStatusSummary(kb: KbBuildResult, mandateName: string) {
  const task = `Erstelle eine kompakte Status-Zusammenfassung für das Mandat "${mandateName}" auf Basis des Mandatswissens oben. Gib zurück:
1. Eine Zeile "STATUS: on_track" ODER "STATUS: at_risk" ODER "STATUS: blocked" (genau einer dieser drei Werte, nichts anderes in dieser Zeile).
2. Danach 3-6 Sätze: aktueller Stand, letzte wichtige Entwicklungen, offene Risiken/Fristen/Blocker, nächste Schritte.
Nutze KEINE Überschriften außer der STATUS-Zeile.`;
  const text = await complete(kb, task, 1024, "medium");
  const match = text.match(/STATUS:\s*(on_track|at_risk|blocked)/i);
  const health = (match?.[1]?.toLowerCase() ?? "on_track") as "on_track" | "at_risk" | "blocked";
  const summary = text.replace(/STATUS:\s*(on_track|at_risk|blocked)\s*/i, "").trim();
  return { summary, health };
}

export async function generateDeliverable(kb: KbBuildResult, instructions: string): Promise<string> {
  const task = `Erstelle auf Basis des Mandatswissens oben ein entscheidungsreifes Deliverable gemäß folgender Anweisung:\n\n${instructions}\n\nFormatiere das Ergebnis in Markdown mit klaren Abschnitten. Wenn eine Entscheidung vorbereitet wird, schließe einen Abschnitt "Empfehlung" ab.`;
  return complete(kb, task, 8000, "high");
}

export async function askMandateQuestion(kb: KbBuildResult, question: string): Promise<string> {
  const task = `Beantworte folgende Frage ausschließlich auf Basis des Mandatswissens oben:\n\n${question}\n\nWenn die Antwort nicht aus dem Mandatswissen hervorgeht, sage das explizit.`;
  return complete(kb, task, 2048, "medium");
}

export function isPiiRedactionEnabled(): boolean {
  return PII_REDACTION_ENABLED;
}

export function currentModel(): string {
  return MODEL;
}
