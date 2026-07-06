# Adaptive Workspace für Kanzleien

Ein KI-gestützter, adaptiver Workspace, in dem Research, Meetings, frühere
Arbeitsergebnisse (Deliverables wie Gutachten, Schriftsätze oder Memos) und
Stakeholder-Signale (Mandant, Gegenseite, Gericht) pro Mandat
zusammenlaufen. Partner:innen sehen jederzeit den aktuellen Stand jedes
Mandats (KI-generierte Statuszusammenfassung + Zeitverlauf) und können
entscheidungsreife Deliverables direkt aus dem gesammelten Mandatswissen
der Kanzlei erzeugen lassen — DSGVO-konform.

Dies ist ein funktionierender Prototyp: lokal lauffähig, mit echtem
Datenmodell und echten KI-Aufrufen (Anthropic Claude API), aber mit
manuell eingepflegtem bzw. eingefügtem Wissen statt Live-Integrationen zu
Teams/Slack/Aktenverwaltung (siehe "Erweiterungsmöglichkeiten" unten).

## Architektur

- **Next.js 16 (App Router, TypeScript, Tailwind v4)** — Full-Stack-App,
  Server Components für Datenzugriff, API-Routen für Mutationen und
  KI-Aktionen.
- **SQLite via `node:sqlite`** (Node ≥ 22, in diesem Projekt integriert,
  kein externer Datenbank-Server nötig) — bewusste Design-Entscheidung für
  lokale Datenresidenz und einfache Inbetriebnahme; siehe
  [`src/lib/db.ts`](src/lib/db.ts). Die Datenbankdatei liegt unter
  `./data/workspace.db` und wird nie ins Repository committed.
- **Anthropic Claude API** (`@anthropic-ai/sdk`) für:
  - automatische Mandats-Statuszusammenfassungen (Ampel-Status +
    Kurztext) aus dem gesamten Mandatswissen,
  - Generierung entscheidungsreifer Deliverables (Memos, Briefings) aus
    dem Mandatswissen,
  - Fragen & Antworten über den Wissensbestand eines Mandats (RAG-artig
    durch direktes Einfügen des relevanten Mandatswissens in den Prompt,
    kein Vektor-Index nötig bei der aktuellen Datenmenge).

### Datenmodell (`src/lib/db.ts`, `src/lib/types.ts`)

| Tabelle | Zweck |
|---|---|
| `mandates` | Mandats-Stammdaten (Bezeichnung, verantwortlicher Partner) + zuletzt generierte KI-Statuszusammenfassung |
| `knowledge_items` | Research, Meetings, frühere Deliverables, Stakeholder-Signale (mit Autor, Quelle, Rechtsgrundlage, Aufbewahrungsfrist) |
| `ai_generations` | Protokoll aller KI-Ausgaben (Statuszusammenfassung, generierte Deliverables, Q&A) inkl. verwendetem Modell und ob PII-Schwärzung angewendet wurde |
| `audit_log` | Verarbeitungsprotokoll für jede Datenänderung und KI-Verarbeitung (Art. 30 DSGVO) |
| `data_subject_requests` | Betroffenenanfragen (Auskunft/Löschung/Berichtigung) |

## Setup

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY eintragen
npm run seed                 # optional: Beispielmandate anlegen
npm run dev
```

Die App läuft dann unter `http://localhost:3000`. Ohne `ANTHROPIC_API_KEY`
funktioniert die App weiterhin für alle Nicht-KI-Funktionen (Mandate und
Wissenselemente anlegen, Privacy Center) — die KI-Aktionen liefern dann
einen verständlichen Fehlerhinweis.

### Relevante Umgebungsvariablen (siehe `.env.example`)

- `ANTHROPIC_API_KEY` — Zugangsschlüssel für die Claude API.
- `ANTHROPIC_MODEL` — Standard `claude-opus-4-8`. Für ein günstigeres
  Kostenprofil kann z.B. `claude-sonnet-5` gesetzt werden.
- `PII_REDACTION_ENABLED` — schaltet die automatische PII-Schwärzung vor
  KI-Aufrufen global ab/an (Standard: an).
- `DATA_DIR` — Speicherort der SQLite-Datei (Standard `./data`).

## Nutzung

1. **Mandat anlegen** auf der Startseite, mit verantwortlichem Partner.
2. Im Mandat unter den Tabs **Research / Meetings / Deliverables /
   Stakeholder-Signale** Wissen eintragen (Copy-&-Paste von Notizen,
   Transkripten, Mandanten-/Gegenseiten-Feedback, früheren Ergebnissen).
3. Im Tab **Übersicht** auf „KI-Status aktualisieren" klicken — die KI
   fasst den aktuellen Stand zusammen und ordnet ihn "Im Plan" / "Risiko" /
   "Blockiert" zu, damit Partner:innen den Stand jedes Mandats auf einen
   Blick sehen.
4. Im Tab **Deliverables** ein neues, entscheidungsreifes Dokument aus dem
   gesamten Mandatswissen generieren lassen (z.B. Entscheidungsmemo für
   einen Vergleichsvorschlag).
5. Im Tab **Frage an die KI** gezielte Fragen zum Mandatswissen stellen.

## DSGVO-Konformität

Diese Anwendung wurde mit Privacy by Design (Art. 25 DSGVO) aufgebaut.
Wichtiger Hinweis: Dies ist eine technische Grundlage, keine
Rechtsberatung — vor Produktivbetrieb sollte ein Datenschutzbeauftragter
die konkrete Verarbeitung (insb. die Übermittlung an die Anthropic API und
etwaige mandantenbezogene bzw. berufsgeheimnisrelevante Daten nach § 203
StGB) prüfen und ggf. eine Datenschutz-Folgenabschätzung durchführen sowie
einen Auftragsverarbeitungsvertrag (AVV) mit Anthropic abschließen.

Umgesetzte Maßnahmen im Überblick:

| DSGVO-Prinzip | Umsetzung |
|---|---|
| **Datenminimierung (Art. 5 Abs. 1 lit. c)** | Nur die für den Zweck notwendigen Felder werden gespeichert (kein generisches Freitext-Profil pro Person, sondern Zuordnung über `subject_email`/`author` nur wo nötig). |
| **Zweckbindung (Art. 5 Abs. 1 lit. b) & Rechtsgrundlage (Art. 6)** | Jeder Wissenseintrag trägt ein `legal_basis`-Feld (Einwilligung / Vertrag / berechtigtes Interesse / rechtliche Verpflichtung). |
| **Speicherbegrenzung (Art. 5 Abs. 1 lit. e)** | Optionales `retention_until`-Datum pro Eintrag; im Privacy Center kann ein Bereinigungslauf ("Speicherbegrenzung") gestartet werden, der abgelaufene Einträge löscht (`POST /api/privacy/retention-sweep`). |
| **Pseudonymisierung / Privacy by Design (Art. 25, Art. 32)** | Vor jedem KI-Aufruf werden E-Mail-Adressen, Telefonnummern und IBANs im übermittelten Kontext automatisch geschwärzt (`src/lib/privacy.ts`, `redactPii`), sofern für den Eintrag nicht explizit deaktiviert. **Grenze:** Die Schwärzung ist regelbasiert (Regex) und keine vollständige NER-Pipeline — Mandanten- oder Gegenseitennamen im Fließtext werden aktuell nicht erkannt. Für den Produktiveinsatz sollte dies durch einen dedizierten PII-Erkennungsdienst ersetzt/ergänzt werden. |
| **Rechenschaftspflicht / Verarbeitungsprotokoll (Art. 30, Art. 5 Abs. 2)** | Jede Datenänderung und jeder KI-Aufruf wird im Audit-Log protokolliert (Akteur, Aktion, Entität, Zeitpunkt, ob Schwärzung angewendet wurde) — einsehbar im Privacy Center. |
| **Recht auf Auskunft (Art. 15)** | Betroffene Person per E-Mail im Privacy Center als Anfrage anlegen → „Daten exportieren" liefert alle zugeordneten Einträge als JSON. |
| **Recht auf Löschung (Art. 17)** | „Daten löschen" entfernt alle Einträge, die einer E-Mail-Adresse zugeordnet sind, unwiderruflich und protokolliert den Vorgang. |
| **Datenresidenz / Kontrolle** | Alle Anwendungsdaten liegen ausschließlich lokal in einer SQLite-Datei — keine Cloud-Synchronisation der Rohdaten. Einzige externe Datenübermittlung ist der KI-Aufruf an die Anthropic API (siehe unten). |
| **Auftragsverarbeitung KI-Anbieter** | Für den Produktiveinsatz ist ein Data Processing Addendum mit Anthropic abzuschließen; die Modellwahl ist über `ANTHROPIC_MODEL` konfigurierbar. |

### Bekannte Grenzen dieses Prototyps (vor Produktivbetrieb zu adressieren)

- Kein Login/Rollenmodell — jede Person mit Zugriff auf die App sieht alle
  Mandate. Für den Produktiveinsatz: Authentifizierung + rollenbasierte
  Zugriffskontrolle (z.B. nur zugeteilte Partner/Team sehen ein Mandat)
  ergänzen — wichtig gerade bei Mandaten mit Konfliktparteien oder
  besonderer Vertraulichkeit.
- PII-Schwärzung ist regelbasiert, keine vollständige Pseudonymisierung.
- Keine Verschlüsselung der SQLite-Datei "at rest" — für Produktivbetrieb
  Festplattenverschlüsselung oder eine verschlüsselte Datenbank vorsehen.
- Kein automatisierter Konfliktcheck (Mandantenidentität ./. bestehende
  Mandate) — vor Produktivbetrieb an die kanzleiinterne
  Konfliktprüfung anzubinden.

## Erweiterungsmöglichkeiten

- Echte Connectoren statt Copy-&-Paste: Microsoft 365 / Teams (Meetings,
  Chat), Aktenverwaltungssysteme (Mandatsakten, Fristenkalender) — die
  KI-Aufrufe sind bereits von der Datenquelle entkoppelt (`buildKnowledgeBaseBlock`
  in `src/lib/ai.ts` nimmt beliebige `KnowledgeItem[]` entgegen).
- Vektor-basierte Suche statt Volltext-Einfügung, sobald der
  Wissensbestand pro Mandat zu groß für den Kontext eines einzelnen
  Prompts wird.
- Rollenbasierte Zugriffskontrolle + SSO, inkl. Sperrung einzelner Mandate
  für nicht zugeteilte Partner (Mandantengeheimnis).
