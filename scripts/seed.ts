import { createProject, createItem } from "../src/lib/repo";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed() {
  const p1 = createProject({
    name: "Markteintritt DACH 2026",
    description: "Vorbereitung des Produktlaunches in Deutschland, Österreich und der Schweiz.",
    owner: "Team Growth",
  });

  createItem({
    project_id: p1.id,
    type: "research",
    title: "Wettbewerbsanalyse DACH-Markt",
    content:
      "Die drei größten Wettbewerber (AlpenSoft, NordCloud, MeridianTech) adressieren primär Enterprise-Kunden. Preislücke im Mittelstand-Segment (50-250 Mitarbeitende) erkennbar. Lokalisierung und DSGVO-Konformität werden von Einkaufsabteilungen als Top-3-Kriterium genannt.",
    author: "Julia Weber",
    source: "Interne Marktstudie Q1 2026",
    occurred_at: daysAgo(40),
  });

  createItem({
    project_id: p1.id,
    type: "meeting",
    title: "Kickoff mit Vertriebsleitung",
    content:
      "Vertrieb erwartet Pricing-Vorschlag bis Ende Monat. Wunsch nach gestaffeltem Modell (Starter/Pro/Enterprise). Rechtsabteilung weist auf notwendige AVV-Vorlage für neue Kunden hin, bevor der erste Vertrag unterschrieben werden kann.",
    author: "Markus Lindner",
    source: "Meeting-Protokoll, Konferenzraum 3",
    occurred_at: daysAgo(35),
  });

  createItem({
    project_id: p1.id,
    type: "stakeholder_signal",
    title: "Feedback von Pilotkunde Borchers & Kollegen",
    content:
      "Ansprechpartner P. Adibelli (p.adibelli@borchers-kollegen.de) äußert Interesse an einer Pilotphase, benötigt aber Klarheit zur Datenverarbeitung außerhalb der EU, bevor ein Vertrag unterzeichnet werden kann. Wunsch nach EU-Hosting-Option.",
    author: "Key Account Management",
    subject_email: "p.adibelli@borchers-kollegen.de",
    source: "E-Mail-Austausch",
    occurred_at: daysAgo(20),
    legal_basis: "legitimate_interest",
  });

  createItem({
    project_id: p1.id,
    type: "deliverable",
    title: "Business Case v1 (Entwurf)",
    content:
      "Erwarteter Umsatz Jahr 1: 480.000 EUR bei 25 Neukunden im Mittelstandssegment. Break-even nach 14 Monaten unter Annahme einer Churn-Rate von 6% p.a. Investitionsbedarf Vertrieb & Marketing: 180.000 EUR.",
    author: "Finance",
    source: "Interne Kalkulation",
    occurred_at: daysAgo(15),
  });

  const p2 = createProject({
    name: "Interne Prozessdigitalisierung",
    description: "Digitalisierung der Angebots- und Rechnungsprozesse.",
    owner: "Team Operations",
  });

  createItem({
    project_id: p2.id,
    type: "research",
    title: "Ist-Stand-Analyse Angebotsprozess",
    content:
      "Aktuell durchschnittlich 4,5 Tage von Anfrage bis Angebotsversand, davon 2 Tage manuelle Freigabe. Größter Engpass: fehlende Vorlagen-Automatisierung und manuelle Preiskalkulation in Excel.",
    author: "Prozessmanagement",
    source: "Interviews mit 8 Mitarbeitenden",
    occurred_at: daysAgo(28),
  });

  createItem({
    project_id: p2.id,
    type: "meeting",
    title: "Abstimmung mit IT zu Tool-Auswahl",
    content:
      "IT favorisiert Erweiterung des bestehenden CRM-Systems statt Einführung eines neuen Tools, um Integrationsaufwand zu reduzieren. Datenschutz-Beauftragter muss vor Go-Live eine Datenschutz-Folgenabschätzung durchführen, da automatisierte Preisentscheidungen betroffen sein könnten.",
    author: "IT-Leitung",
    source: "Meeting-Notizen",
    occurred_at: daysAgo(10),
  });

  console.log(`Seed abgeschlossen: Projekte ${p1.id}, ${p2.id}`);
}

seed();
