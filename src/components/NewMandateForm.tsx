"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NewMandateForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [owner, setOwner] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/mandates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, owner }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler beim Erstellen");
      const { mandate } = await res.json();
      setOpen(false);
      setName("");
      setDescription("");
      setOwner("");
      router.push(`/mandates/${mandate.id}`);
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
    <form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label className="block text-xs font-medium text-slate-600">Mandatsbezeichnung</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          placeholder="z.B. M&A-Transaktion Nordwind Industrie GmbH"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Kurzbeschreibung</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          rows={2}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600">Verantwortlicher Partner</label>
        <input
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
          placeholder="Name des Partners / Teams"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Erstelle…" : "Erstellen"}
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
