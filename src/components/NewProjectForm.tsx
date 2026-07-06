"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PracticeArea } from "@/lib/types";

const PRACTICE_AREAS: { value: PracticeArea; label: string }[] = [
  { value: "corporate", label: "Gesellschaftsrecht / M&A" },
  { value: "litigation", label: "Prozessführung / Schiedsverfahren" },
  { value: "ip", label: "IP / IT-Recht" },
  { value: "employment", label: "Arbeitsrecht" },
  { value: "tax", label: "Steuerrecht" },
  { value: "real_estate", label: "Immobilienrecht" },
  { value: "banking", label: "Bank- & Kapitalmarktrecht" },
  { value: "regulatory", label: "Regulierung / Compliance" },
  { value: "other", label: "Sonstiges" },
];

export function NewProjectForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileNumber, setFileNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [practiceArea, setPracticeArea] = useState<PracticeArea | "">("");
  const [leadPartner, setLeadPartner] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          owner: leadPartner,
          file_number: fileNumber || null,
          client_name: clientName || null,
          practice_area: practiceArea || null,
          lead_partner: leadPartner || null,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler beim Erstellen");
      const { project } = await res.json();
      setOpen(false);
      setName("");
      setDescription("");
      setFileNumber("");
      setClientName("");
      setPracticeArea("");
      setLeadPartner("");
      router.push(`/projects/${project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        + Neues Mandat
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-lg space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-600">Mandatsbezeichnung *</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            placeholder="z.B. Übernahme TechCorp GmbH"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Aktenzeichen</label>
          <input
            value={fileNumber}
            onChange={(e) => setFileNumber(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm font-mono"
            placeholder="z.B. 2026-M-0042"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-slate-600">Mandant</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
            placeholder="Name des Mandanten"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Rechtsgebiet</label>
          <select
            value={practiceArea}
            onChange={(e) => setPracticeArea(e.target.value as PracticeArea)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          >
            <option value="">— Bitte wählen —</option>
            {PRACTICE_AREAS.map((pa) => (
              <option key={pa.value} value={pa.value}>
                {pa.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Federführender Partner</label>
        <input
          value={leadPartner}
          onChange={(e) => setLeadPartner(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          placeholder="Name des verantwortlichen Partners"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Kurzbeschreibung</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          rows={2}
          placeholder="Kurze Beschreibung des Mandats"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Erstelle…" : "Mandat anlegen"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}
