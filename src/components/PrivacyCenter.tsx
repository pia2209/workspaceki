"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuditLogEntry, DataSubjectRequest } from "@/lib/types";

export function PrivacyCenter({
  auditLog,
  requests,
  piiRedactionEnabled,
  model,
}: {
  auditLog: AuditLogEntry[];
  requests: DataSubjectRequest[];
  piiRedactionEnabled: boolean;
  model: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"access" | "erasure" | "rectification">("access");
  const [busy, setBusy] = useState<string | null>(null);
  const [exportResult, setExportResult] = useState<unknown | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/privacy/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_email: email, request_type: type }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? "Fehler");
      return;
    }
    setEmail("");
    router.refresh();
  }

  async function handleAccess(dsr: DataSubjectRequest) {
    setBusy(dsr.id);
    try {
      const res = await fetch(`/api/privacy/export?email=${encodeURIComponent(dsr.subject_email)}&dsr_id=${dsr.id}`);
      const data = await res.json();
      setExportResult(data);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function handleErasure(dsr: DataSubjectRequest) {
    if (!confirm(`Alle Daten zu ${dsr.subject_email} unwiderruflich löschen?`)) return;
    setBusy(dsr.id);
    try {
      await fetch("/api/privacy/erase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: dsr.subject_email, dsr_id: dsr.id }),
      });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  async function runRetentionSweep() {
    setBusy("sweep");
    try {
      const res = await fetch("/api/privacy/retention-sweep", { method: "POST" });
      const data = await res.json();
      alert(`${data.deleted_count} abgelaufene(r) Eintrag/Einträge gelöscht.`);
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Privacy Center</h1>
      <p className="mt-1 text-sm text-slate-500">DSGVO-Maßnahmen, Betroffenenrechte und Verarbeitungsprotokoll dieses Workspace.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard title="Datenhaltung" value="Lokal (SQLite-Datei)" hint="Keine Cloud-Synchronisation, volle Datenresidenz-Kontrolle" />
        <InfoCard title="PII-Schwärzung vor KI-Verarbeitung" value={piiRedactionEnabled ? "Aktiv" : "Deaktiviert"} hint="Art. 25 / 32 DSGVO" />
        <InfoCard title="KI-Modell" value={model} hint="Anthropic Claude API" />
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Betroffenenanfragen</h2>
        <p className="mt-1 text-sm text-slate-500">
          Anfragen auf Auskunft (Art. 15), Löschung (Art. 17) oder Berichtigung (Art. 16) verwalten.
        </p>
        <form onSubmit={createRequest} className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600">E-Mail der betroffenen Person</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Art der Anfrage</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="mt-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            >
              <option value="access">Auskunft (Art. 15)</option>
              <option value="erasure">Löschung (Art. 17)</option>
              <option value="rectification">Berichtigung (Art. 16)</option>
            </select>
          </div>
          <button type="submit" className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
            Anfrage anlegen
          </button>
        </form>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <ul className="mt-4 space-y-2">
          {requests.length === 0 && <p className="text-sm text-slate-400">Keine Anfragen vorhanden.</p>}
          {requests.map((r) => (
            <li key={r.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
              <div>
                <span className="font-medium">{r.subject_email}</span>{" "}
                <span className="text-slate-400">
                  · {r.request_type} · {new Date(r.created_at).toLocaleDateString("de-DE")} ·{" "}
                  {r.status === "completed" ? "erledigt" : "offen"}
                </span>
              </div>
              {r.status !== "completed" && (
                <div className="flex gap-2">
                  {r.request_type === "access" && (
                    <button
                      onClick={() => handleAccess(r)}
                      disabled={busy === r.id}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium hover:bg-slate-50"
                    >
                      Daten exportieren
                    </button>
                  )}
                  {r.request_type === "erasure" && (
                    <button
                      onClick={() => handleErasure(r)}
                      disabled={busy === r.id}
                      className="rounded-md border border-red-300 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Daten löschen
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>

        {exportResult != null && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-900 p-4">
            <p className="mb-2 text-xs font-medium text-slate-300">Export-Ergebnis (Art. 15)</p>
            <pre className="max-h-80 overflow-auto text-xs text-slate-100">{JSON.stringify(exportResult, null, 2)}</pre>
          </div>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Speicherbegrenzung</h2>
            <p className="mt-1 text-sm text-slate-500">Löscht Projektwissen-Einträge, deren Aufbewahrungsfrist abgelaufen ist (Art. 5 Abs. 1 lit. e).</p>
          </div>
          <button
            onClick={runRetentionSweep}
            disabled={busy === "sweep"}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
          >
            Jetzt prüfen &amp; löschen
          </button>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Verarbeitungsprotokoll (Audit-Log)</h2>
        <p className="mt-1 text-sm text-slate-500">Nachvollziehbarkeit gemäß Art. 30 DSGVO — jede Datenänderung und KI-Verarbeitung wird protokolliert.</p>
        <div className="mt-4 overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2">Zeitpunkt</th>
                <th className="px-3 py-2">Aktion</th>
                <th className="px-3 py-2">Entität</th>
                <th className="px-3 py-2">Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((entry) => (
                <tr key={entry.id} className="border-t border-slate-100">
                  <td className="whitespace-nowrap px-3 py-2 text-slate-400">{new Date(entry.created_at).toLocaleString("de-DE")}</td>
                  <td className="px-3 py-2 font-medium">{entry.action}</td>
                  <td className="px-3 py-2 text-slate-500">
                    {entry.entity_type} {entry.entity_id ? `#${entry.entity_id.slice(0, 12)}` : ""}
                  </td>
                  <td className="px-3 py-2 text-slate-400">{entry.details}</td>
                </tr>
              ))}
              {auditLog.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-slate-400">
                    Noch keine Einträge.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium text-slate-500">{title}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </div>
  );
}
