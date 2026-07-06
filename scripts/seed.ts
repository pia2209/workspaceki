import { createProject, createItem } from "../src/lib/repo";

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function seed() {
  const p1 = createProject({
    name: "Übernahme TechCorp GmbH",
    description: "Beratung der Käuferseite bei der Übernahme eines Softwareunternehmens. Due Diligence, Vertragsverhandlungen und Closing.",
    owner: "Dr. Anna Bergmann",
    file_number: "2026-M-0042",
    client_name: "InnoVest Capital AG",
    practice_area: "corporate",
    lead_partner: "Dr. Anna Bergmann",
  });

  createItem({
    project_id: p1.id,
    type: "research",
    title: "Legal Due Diligence - Wesentliche Verträge",
    content:
      `Die Due Diligence der wesentlichen Verträge hat folgende Erkenntnisse ergeben:

1. Kundenverträge: 85% der Verträge enthalten Standard-Kündigungsklauseln (3 Monate zum Quartalsende). Allerdings fehlen bei 12 Großkundenverträgen (Volumen > 100k EUR p.a.) Change-of-Control-Klauseln.

2. Lieferantenverträge: Der Cloud-Hosting-Vertrag mit AWS hat eine Mindestlaufzeit bis 2028. Eine vorzeitige Kündigung würde ca. 450.000 EUR kosten.

3. Arbeitsverträge: Die 3 Geschäftsführer haben Sonderkündigungsrechte bei Kontrollwechsel mit Abfindungsansprüchen von je 12 Monatsgehältern.

4. IP-Rechte: Alle wesentlichen Urheberrechte an der Software wurden wirksam von den Entwicklern auf die Gesellschaft übertragen. Keine erkennbaren Rechtsmängel.

Empfehlung: Change-of-Control-Klauseln in Großkundenverträgen sollten vor Closing adressiert werden (Kundenzustimmungen einholen oder Gewährleistung im SPA).`,
    author: "RA Dr. Thomas Meier",
    source: "Due Diligence Report v2",
    occurred_at: daysAgo(25),
  });

  createItem({
    project_id: p1.id,
    type: "meeting",
    title: "Mandantengespräch zur Verhandlungsstrategie",
    content:
      `Teilnehmer: Dr. Bergmann, RA Dr. Meier, Hr. Schulze (CFO InnoVest), Fr. Weber (M&A InnoVest)

Besprochene Punkte:
- Kaufpreis: Mandant ist bereit, bis 8,5 Mio EUR zu gehen (ursprüngliches Angebot: 7,2 Mio EUR). Verkäufer fordert derzeit 9,0 Mio EUR.
- Gewährleistungen: Mandant wünscht 24 Monate Gewährleistungsfrist, Standard bei Verkäufer ist 18 Monate
- Escrow: 10% des Kaufpreises auf Escrow-Konto für 18 Monate als Sicherheit für W&I-Ansprüche
- Closing Conditions: Zustimmung der Top-5-Kunden zu Change-of-Control wird als Bedingung gewünscht

Nächste Schritte:
- SPA-Entwurf bis Ende der Woche an Gegenseite
- Mandant holt parallel Kundenzustimmungen informell ein`,
    author: "Dr. Anna Bergmann",
    source: "Besprechungsprotokoll, Kanzlei",
    occurred_at: daysAgo(18),
  });

  createItem({
    project_id: p1.id,
    type: "deliverable",
    title: "Share Purchase Agreement Entwurf v1",
    content:
      `Wesentliche Regelungen des SPA-Entwurfs:

§ 2 Kaufgegenstand: 100% der Geschäftsanteile an der TechCorp GmbH
§ 3 Kaufpreis: [BETRAG] EUR, zahlbar bei Closing abzüglich Escrow
§ 4 Escrow: 10% des Kaufpreises für 18 Monate
§ 5 Closing Conditions: 
  (a) Kartellrechtliche Freigabe (nicht erforderlich da unter Aufgreifschwellen)
  (b) Keine MAC zwischen Signing und Closing
  (c) Zustimmung der Top-5-Kunden
§ 6 Gewährleistungen: Umfassender Katalog, 24 Monate Laufzeit, De-minimis 10.000 EUR, Basket 50.000 EUR, Cap 30% des Kaufpreises
§ 7 Freistellungen: Steuerfreistellung für Zeiträume vor Closing
§ 8 Non-Compete: 3 Jahre, deutschlandweit, Softwarebranche

Status: Interner Review abgeschlossen, Freigabe durch Partner ausstehend`,
    author: "RA Dr. Thomas Meier",
    source: "Vertragsentwurf",
    occurred_at: daysAgo(12),
  });

  createItem({
    project_id: p1.id,
    type: "stakeholder_signal",
    title: "Rückmeldung der Gegenseite zum SPA",
    content:
      `E-Mail von RA Hoffmann (Kanzlei der Verkäufer):

"Sehr geehrte Frau Dr. Bergmann,

nach Prüfung des SPA-Entwurfs haben unsere Mandanten folgende wesentliche Änderungswünsche:

1. Kaufpreis: 8,8 Mio EUR als Kompromiss (ursprünglich 9,0 Mio EUR gefordert)
2. Gewährleistungsfrist: Maximal 18 Monate akzeptabel
3. Escrow: Nur 7,5% akzeptabel, da die Gesellschaft solide aufgestellt ist
4. Top-5-Kundenzustimmung: Nur als Best-Efforts-Verpflichtung, nicht als Closing Condition
5. Non-Compete: Nur 2 Jahre, da einer der Gesellschafter-Geschäftsführer Beratungsmandate fortführen möchte

Wir bitten um kurzfristige Rückmeldung, da unsere Mandanten das Closing bis Ende Q2 anstreben.

Mit freundlichen Grüßen,
RA Hoffmann"`,
    author: "RA Dr. Thomas Meier",
    subject_email: "hoffmann@gegenseite-kanzlei.de",
    source: "E-Mail vom 15.06.2026",
    occurred_at: daysAgo(8),
    legal_basis: "contract",
  });

  createItem({
    project_id: p1.id,
    type: "meeting",
    title: "Interne Strategiebesprechung",
    content:
      `Teilnehmer: Dr. Bergmann, RA Dr. Meier

Analyse der Gegenseite-Position:
- Kaufpreis 8,8 Mio EUR liegt in unserem Verhandlungsspielraum (Budget bis 8,5 Mio, aber CFO hat signalisiert dass 8,8 Mio bei guten sonstigen Konditionen vertretbar)
- 18 Monate Gewährleistung ist akzeptabel
- 7,5% Escrow ist zu niedrig angesichts der identifizierten Risiken (Change-of-Control-Klauseln)
- Kundenzustimmung als Best-Efforts ist riskant, da 3 der Top-5-Kunden 45% des Umsatzes ausmachen
- 2 Jahre Non-Compete nur akzeptabel wenn geografisch auf DACH beschränkt

Empfehlung an Mandanten:
- Kaufpreis 8,8 Mio EUR akzeptieren
- Bei Escrow auf 10% bestehen
- Kundenzustimmung: Kompromiss: Top-3-Kunden als Closing Condition, Top-4-5 als Best-Efforts
- Non-Compete: 2 Jahre, aber nur DACH-Region als Kompromiss`,
    author: "Dr. Anna Bergmann",
    source: "Interne Notiz",
    occurred_at: daysAgo(5),
  });

  const p2 = createProject({
    name: "Arbeitsrechtliche Restrukturierung Müller AG",
    description: "Beratung bei Personalabbau und Interessenausgleich/Sozialplan.",
    owner: "RA Dr. Sabine Klein",
    file_number: "2026-M-0038",
    client_name: "Müller AG",
    practice_area: "employment",
    lead_partner: "RA Dr. Sabine Klein",
  });

  createItem({
    project_id: p2.id,
    type: "research",
    title: "Rechtliche Rahmenbedingungen Massenentlassung",
    content:
      `Bei der geplanten Restrukturierung (Abbau von 85 der 320 Arbeitsplätze am Standort Stuttgart) sind folgende Anforderungen zu beachten:

1. Massenentlassungsanzeige (§ 17 KSchG):
   - Bei mehr als 30 Entlassungen in Betrieben mit 500+ AN erforderlich
   - Anzeige bei Agentur für Arbeit mindestens 30 Tage vor erster Kündigung
   - Sperrfrist: 1 Monat ab Eingang der Anzeige

2. Betriebsänderung (§ 111 BetrVG):
   - Stilllegung wesentlicher Betriebsteile = Betriebsänderung
   - Interessenausgleich und Sozialplan erforderlich
   - Einigungsstelle bei Nichteinigung über Sozialplan

3. Sozialauswahl (§ 1 Abs. 3 KSchG):
   - Kriterien: Betriebszugehörigkeit, Lebensalter, Unterhaltspflichten, Schwerbehinderung
   - Leistungsträger können ausgenommen werden (Dokumentation!)

Risiko: Bei Verfahrensfehlern sind Kündigungen anfechtbar. Zeitrahmen für ordnungsgemäßes Verfahren: mindestens 3-4 Monate.`,
    author: "RA Markus Weber",
    source: "Rechtsgutachten",
    occurred_at: daysAgo(30),
  });

  createItem({
    project_id: p2.id,
    type: "meeting",
    title: "Erstgespräch mit Betriebsrat",
    content:
      `Teilnehmer: Dr. Klein, RA Weber, BR-Vorsitzender Herr Schmidt, stellv. BR-Vorsitzende Frau Yilmaz

Standpunkt des Betriebsrats:
- BR akzeptiert grundsätzlich wirtschaftliche Notwendigkeit der Restrukturierung
- Fordert Abfindungsformel: 1,5 Monatsgehälter pro Beschäftigungsjahr (Arbeitgeber bietet 0,75)
- Transfergesellschaft für mindestens 12 Monate gefordert
- Aufstockung von Altersteilzeit für AN ab 55 Jahren
- Outplacement-Beratung für alle Betroffenen

BR droht mit langwieriger Einigungsstelle, wenn Arbeitgeber nicht substanziell entgegenkommt.

Zeitplan BR: Will Sozialplan bis Ende Juli abschließen, um AN nicht in Sommerpause zu verunsichern.

Nächster Termin: In 10 Tagen, nach Rücksprache mit Mandant zu Budgetrahmen für Sozialplan.`,
    author: "RA Dr. Sabine Klein",
    source: "Besprechungsprotokoll",
    occurred_at: daysAgo(20),
  });

  createItem({
    project_id: p2.id,
    type: "stakeholder_signal",
    title: "Budgetvorgabe vom Vorstand",
    content:
      `Telefonat mit Vorstandsvorsitzendem Dr. Schulze:

Kernaussagen:
- Maximalbudget für Sozialplan: 4,5 Mio EUR (ca. 53.000 EUR pro betroffenem AN)
- Abfindungsformel max. 1,0 Gehälter pro Jahr Betriebszugehörigkeit
- Transfergesellschaft maximal 9 Monate finanzierbar
- Altersteilzeit nur in Ausnahmefällen (max. 10 AN)

Vorstand möchte Einigungsstelle wenn möglich vermeiden (Kosten, Zeitverzögerung, Außenwirkung).

"Frau Dr. Klein, wir brauchen eine Lösung, die der Betriebsrat mitträgt, aber wir können nicht unbegrenzt Geld ausgeben. Die Restrukturierung ist notwendig, um langfristig 235 Arbeitsplätze zu sichern."`,
    author: "RA Dr. Sabine Klein",
    subject_email: "schulze@mueller-ag.de",
    source: "Telefonnotiz",
    occurred_at: daysAgo(15),
    legal_basis: "contract",
  });

  createItem({
    project_id: p2.id,
    type: "deliverable",
    title: "Sozialplan-Entwurf v1",
    content:
      `Eckpunkte des Sozialplanentwurfs:

1. ABFINDUNGEN
   - Grundformel: Bruttomonatsgehalt × Betriebszugehörigkeit × 0,85
   - Mindestsumme: 5.000 EUR
   - Höchstbetrag: 80.000 EUR
   - Zuschläge: Unterhaltspflichtige Kinder (+3.000 EUR/Kind), Schwerbehinderung (+5.000 EUR)

2. TRANSFERGESELLSCHAFT
   - Laufzeit: 9 Monate
   - Aufstockung auf 80% des letzten Nettogehalts
   - Qualifizierungsbudget: 3.000 EUR pro Teilnehmer

3. ALTERSTEILZEIT
   - Für AN ab 57 Jahren mit mind. 15 Jahren Betriebszugehörigkeit
   - Blockmodell: 2 Jahre Arbeit, 2 Jahre Freistellung
   - Kontingent: 10 Plätze

4. SONSTIGE LEISTUNGEN
   - Outplacement-Beratung (Gruppenveranstaltungen)
   - Bevorzugte Wiedereinstellung bei AN mit >10 Jahren Betriebszugehörigkeit
   - Turbo-Prämie: 20% Abfindungsaufschlag bei Annahme innerhalb 2 Wochen

Geschätzte Gesamtkosten: 4,2 Mio EUR (im Budgetrahmen)`,
    author: "RA Markus Weber",
    source: "Entwurf Sozialplan",
    occurred_at: daysAgo(10),
  });

  const p3 = createProject({
    name: "Patentstreit SmartDevice vs. TechGiant",
    description: "Verteidigung gegen Patentverletzungsklage im Bereich IoT-Technologie.",
    owner: "RA Prof. Dr. Michael Neumann",
    file_number: "2026-L-0015",
    client_name: "SmartDevice GmbH",
    practice_area: "ip",
    lead_partner: "RA Prof. Dr. Michael Neumann",
  });

  createItem({
    project_id: p3.id,
    type: "research",
    title: "Analyse der Klageschrift und Patentansprüche",
    content:
      `TechGiant Inc. macht Verletzung des EP 2 345 678 B1 ("Verfahren zur energieeffizienten Datenübertragung in IoT-Netzwerken") geltend.

Anspruch 1 (Hauptanspruch):
"Verfahren zur Datenübertragung in einem IoT-Netzwerk, umfassend:
a) Erfassen von Sensordaten durch ein IoT-Gerät,
b) Komprimieren der Sensordaten mittels eines adaptiven Kompressionsalgorithmus,
c) Übertragen der komprimierten Daten in einem Burst-Modus bei optimaler Netzwerklast,
d) Aktivieren eines Sleep-Modus nach Übertragung."

Vorläufige Einschätzung:
- Merkmal a) und d) werden von unserem Produkt "SmartSensor Pro" unstreitig verwirklicht
- Merkmal b): Unser Algorithmus ist anders implementiert, Verwirklichung zweifelhaft
- Merkmal c): "Burst-Modus bei optimaler Netzwerklast" ist unklar definiert, Auslegung streitig

Verteidigungsstrategie:
1. Nichtverletzung: Merkmale b) und c) werden nicht wortsinngemäß verwirklicht
2. Nichtigkeitseinwand: Prior Art recherchieren (IEEE-Publikationen, ältere Patente)
3. Erschöpfung: Prüfen ob Komponenten von lizenzierten Zulieferern stammen`,
    author: "RA Dr. Lisa Hoffmann (Patentanwältin)",
    source: "Klageanalyse",
    occurred_at: daysAgo(45),
  });

  createItem({
    project_id: p3.id,
    type: "meeting",
    title: "Strategiebesprechung mit Mandant",
    content:
      `Teilnehmer: Prof. Dr. Neumann, RA Dr. Hoffmann, CTO Herr Bauer (SmartDevice), GF Herr Krause

Geschäftliche Hintergründe:
- SmartSensor Pro macht 40% des Umsatzes von SmartDevice aus
- Produktionseinstellung würde existenzbedrohend sein
- TechGiant hat vor 6 Monaten Übernahmeangebot für SmartDevice gemacht (abgelehnt)
- Verdacht: Patentklage als Druckmittel für erneute Übernahmeverhandlungen

Technische Diskussion mit CTO:
- Kompressionsalgorithmus wurde intern entwickelt, basiert auf anderem Prinzip als Patent
- "Burst-Modus" im Produkt technisch anders gelöst (kontinuierliche Übertragung mit Pufferung)
- CTO kann als sachverständiger Zeuge aussagen

Entscheidung:
- Umfassende Klageerwiderung mit Nichtverletzungseinwand
- Parallel Nichtigkeitsklage vorbereiten (separate Beauftragung Patentanwalt)
- Keine Vergleichsgespräche initiieren, um Schwäche nicht zu signalisieren

Budget: Mandant genehmigt bis zu 150.000 EUR für erste Instanz`,
    author: "RA Prof. Dr. Michael Neumann",
    source: "Besprechungsprotokoll",
    occurred_at: daysAgo(38),
  });

  createItem({
    project_id: p3.id,
    type: "stakeholder_signal",
    title: "Schreiben der Gegenseite",
    content:
      `Schreiben von Baker & Partners LLP (US-Kanzlei, DE-Prozessbevollmächtigte für TechGiant):

"Dear Mr. Neumann,

Our client has authorized us to explore settlement options before further escalation. TechGiant would be prepared to grant SmartDevice GmbH a non-exclusive license to EP 2 345 678 B1 under the following conditions:

1. Running royalty of 8% of net sales of SmartSensor Pro and successor products
2. Minimum annual royalty of EUR 500,000
3. Acknowledgment of patent validity and infringement
4. License term: Remaining patent lifetime (until 2035)

This offer is valid for 30 days. Please note that TechGiant is also considering seeking a preliminary injunction if no settlement is reached.

Regards,
Dr. James Miller
Baker & Partners LLP"

Bewertung: 8% Lizenzgebühr wäre wirtschaftlich nicht tragbar (Marge SmartSensor Pro: ca. 15%). Androhung der einstweiligen Verfügung ist ernst zu nehmen.`,
    author: "RA Prof. Dr. Michael Neumann",
    subject_email: "miller@bakerpartners.com",
    source: "Brief vom 20.05.2026",
    occurred_at: daysAgo(25),
    legal_basis: "legitimate_interest",
  });

  createItem({
    project_id: p3.id,
    type: "deliverable",
    title: "Klageerwiderung (Entwurf)",
    content:
      `KLAGEERWIDERUNG (Entwurf)

In Sachen TechGiant Inc. ./. SmartDevice GmbH
Az. 7 O 4521/26 - LG München I

wird beantragt, die Klage abzuweisen.

BEGRÜNDUNG:

I. Zum Sachverhalt
[...]

II. Keine Verletzung des Klagepatents

1. Merkmal b) - Adaptiver Kompressionsalgorithmus
Das angegriffene Produkt verwendet keinen "adaptiven Kompressionsalgorithmus" im Sinne des Klagepatents. Die Patentschrift definiert diesen als Algorithmus, der die Kompressionsrate basierend auf Netzwerkbedingungen in Echtzeit anpasst (Sp. 4, Z. 15-23).

Der im SmartSensor Pro implementierte Algorithmus verwendet hingegen eine vorberechnete, statische Kompression basierend auf Datentyp. Eine Anpassung an Netzwerkbedingungen erfolgt nicht. (Anlage B1: Technische Dokumentation, Anlage B2: Eidesstattliche Versicherung CTO)

2. Merkmal c) - Burst-Modus bei optimaler Netzwerklast
[...]

III. Hilfsweise: Nichtigkeitseinwand
Das Klagepatent ist nichtig mangels erfinderischer Tätigkeit. Die Merkmale a), b) und d) waren zum Prioritätszeitpunkt aus dem Stand der Technik bekannt:
- US 7,xxx,xxx (Anlage B3)
- IEEE-Publikation Chen et al. 2015 (Anlage B4)
[...]

IV. Kostenentscheidung
[...]`,
    author: "RA Prof. Dr. Michael Neumann",
    source: "Schriftsatzentwurf",
    occurred_at: daysAgo(15),
  });

  console.log(`Seed abgeschlossen: Mandate ${p1.id}, ${p2.id}, ${p3.id}`);
}

seed();
