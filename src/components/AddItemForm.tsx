"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ItemType } from "@/lib/types";

const PLACEHOLDERS: Record<ItemType, { title: string; content: string }> = {
  research: { title: "z.B. Rechtsprechungsübersicht zu §626 BGB", content: "Research-Notizen, Zusammenfassung, Fundstellen, Kernaussagen…" },
  meeting: { title: "z.B. Mandantengespräch Erstberatung", content: "Meeting-Notizen oder Transkript einfügen…" },
  deliverable: { title: "z.B. Gutachten Entwurf v1", content: "Inhalt des früheren Arbeitsergebnisses…" },
  stakeholder_signal: { title: "z.B. Nachricht der Gegenseite", content: "Feedback, Anfrage oder Signal von Mandant, Gegenseite oder Gericht…" },
};

export function AddItemForm({ mandateId, type, onAdded }: { mandateId: string; type: ItemType; onAdded?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [subjectEmail, setSubjectEmail] = useState("");
  const [piiRedact, setPiiRedact] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ph = PLACEHOLDERS[type];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/mandates/${mandateId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          title,
          content,
          author,
          subject_email: subjectEmail || null,
          pii_redact: piiRedact,
          occurred_at: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler beim Speichern");
      setTitle("");
      setContent("");
      setAuthor("");
      setSubjectEmail("");
      setOpen(false);
      router.refresh();
      onAdded?.();
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
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        + Eintrag hinzufügen
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={ph.title}
        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
      />
      <textarea
        required
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={ph.content}
        rows={5}
        className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
      />
      <div className="flex flex-wrap gap-3">
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Autor / Quelle-Person"
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        <input
          value={subjectEmail}
          onChange={(e) => setSubjectEmail(e.target.value)}
          placeholder="Betroffene E-Mail (optional, für DSGVO-Anfragen)"
          className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
      </div>
      <label className="flex items-center gap-2 text-xs text-slate-500">
        <input type="checkbox" checked={piiRedact} onChange={(e) => setPiiRedact(e.target.checked)} />
        Personenbezogene Daten vor KI-Verarbeitung automatisch schwärzen (empfohlen)
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Speichere…" : "Speichern"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100">
          Abbrechen
        </button>
      </div>
    </form>
  );
}
