import { createMandate, createItem } from "../src/lib/repo";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed() {
  const m1 = createMandate({
    name: "M&A-Transaktion Nordwind Industrie GmbH",
    description: "Beratung des Käufers beim Erwerb der Nordwind Industrie GmbH (Signing voraussichtlich Q3).",
    owner: "P. Adibelli, Partner",
  });

  createItem({
    mandate_id: m1.id,
    type: "research",
    title: "Due-Diligence-Kurzanalyse Zielgesellschaft",
    content:
      "Legal-Due-Diligence zeigt zwei wesentliche Change-of-Control-Klauseln in Kernlieferverträgen sowie ein laufendes, nicht wesentliches Kartellverfahren gegen einen Wettbewerber der Zielgesellschaft (keine unmittelbare Betroffenheit). Empfehlung: Zustimmungsvorbehalte der betroffenen Vertragspartner vor Signing einholen.",
    author: "Julia Weber",
    source: "Due-Diligence-Bericht Entwurf",
    occurred_at: daysAgo(40),
  });

  createItem({
    mandate_id: m1.id,
    type: "meeting",
    title: "Kickoff mit Geschäftsführung der Zielgesellschaft",
    content:
      "Geschäftsführung erwartet ersten SPA-Entwurf bis Ende Monat. Wunsch nach gestaffeltem Kaufpreis (Closing + Earn-out über 2 Jahre). Datenschutzbeauftragter der Zielgesellschaft weist auf notwendigen AVV mit dem Datenraum-Anbieter hin, bevor weitere Unterlagen hochgeladen werden.",
    author: "Markus Lindner",
    source: "Meeting-Protokoll, Konferenzraum 3",
    occurred_at: daysAgo(35),
  });

  createItem({
    mandate_id: m1.id,
    type: "stakeholder_signal",
    title: "Rückfrage der Gegenseite zu Signing-Termin",
    content:
      "Gegnerischer Anwalt K. Nordmann (k.nordmann@gegenseite-legal.de) fragt an, ob Signing auf die letzte Augustwoche vorgezogen werden kann, da die Zielgesellschaft ihr Geschäftsjahr zum 31.8. abschließt. Bittet um Rückmeldung bis Ende der Woche.",
    author: "Kanzlei Gegenseite",
    subject_email: "k.nordmann@gegenseite-legal.de",
    source: "E-Mail-Austausch",
    occurred_at: daysAgo(20),
    legal_basis: "legitimate_interest",
  });

  createItem({
    mandate_id: m1.id,
    type: "deliverable",
    title: "Entwurf Unternehmenskaufvertrag (SPA) v1",
    content:
      "Kaufpreis: 12,4 Mio. EUR Basiskaufpreis zzgl. Earn-out bis 2,0 Mio. EUR über 2 Jahre bei Erreichen definierter EBITDA-Ziele. Closing-Bedingungen: Zustimmung Kartellbehörde nicht erforderlich (unterhalb Aufgreifschwellen), Zustimmung zweier Kernlieferanten erforderlich (Change-of-Control).",
    author: "Team M&A",
    source: "Interner Entwurf",
    occurred_at: daysAgo(15),
  });

  const m2 = createMandate({
    name: "Kündigungsschutzprozess Krammer ./. Elbtal Logistik GmbH",
    description: "Vertretung der Elbtal Logistik GmbH in einem Kündigungsschutzverfahren vor dem Arbeitsgericht.",
    owner: "Dr. Julia Weber, Partnerin",
  });

  createItem({
    mandate_id: m2.id,
    type: "research",
    title: "Rechtsprechungsübersicht zu betriebsbedingten Kündigungen (BAG)",
    content:
      "Aktuelle BAG-Rechtsprechung verlangt bei betriebsbedingten Kündigungen eine nachvollziehbare unternehmerische Entscheidung sowie eine ordnungsgemäße Sozialauswahl nach § 1 Abs. 3 KSchG. Schwachstelle im vorliegenden Fall: Sozialauswahl wurde nur innerhalb einer Abteilung, nicht betriebsweit durchgeführt.",
    author: "Referendarin",
    source: "Rechtsprechungsdatenbank",
    occurred_at: daysAgo(28),
  });

  createItem({
    mandate_id: m2.id,
    type: "meeting",
    title: "Abstimmung mit Mandant zur Prozessstrategie",
    content:
      "Mandant favorisiert Vergleich vor dem Gütetermin, um Prozessrisiko wegen der lückenhaften Sozialauswahl zu vermeiden. Budgetrahmen für Abfindungsvergleich: bis zu 1,5 Bruttomonatsgehälter pro Beschäftigungsjahr.",
    author: "Personalleitung Elbtal Logistik",
    source: "Meeting-Notizen",
    occurred_at: daysAgo(18),
  });

  createItem({
    mandate_id: m2.id,
    type: "stakeholder_signal",
    title: "Ladung zum Gütetermin durch das Arbeitsgericht",
    content:
      "Arbeitsgericht Hamburg lädt beide Parteien zum Gütetermin am [Termin siehe Ladung]. Klägervertreterin kündigt an, in der mündlichen Verhandlung zusätzlich einen Auflösungsantrag der Gegenseite zu thematisieren, sollte kein Vergleich zustande kommen.",
    author: "Arbeitsgericht Hamburg",
    source: "Gerichtliche Ladung",
    occurred_at: daysAgo(8),
    legal_basis: "legal_obligation",
  });

  createItem({
    mandate_id: m2.id,
    type: "deliverable",
    title: "Klageerwiderung (Entwurf)",
    content:
      "Entwurf verteidigt die Sozialauswahl unter Verweis auf Herausnahme von Leistungsträgern (§ 1 Abs. 3 Satz 2 KSchG) und schlägt hilfsweise einen Abfindungsvergleich in Höhe von 1,2 Bruttomonatsgehältern pro Beschäftigungsjahr vor.",
    author: "Team Arbeitsrecht",
    source: "Interner Entwurf",
    occurred_at: daysAgo(5),
  });

  console.log(`Seed abgeschlossen: Mandate ${m1.id}, ${m2.id}`);
}

seed();
