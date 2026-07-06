"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AiGeneration } from "@/lib/types";

export function GenerateDeliverableForm({ mandateId, generations }: { mandateId: string; generations: AiGeneration[] }) {
  const router = useRouter();
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiGeneration | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/mandates/${mandateId}/deliverable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ instructions }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler bei der Erstellung");
      const { generation } = await res.json();
      setResult(generation);
      setInstructions("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">Neues entscheidungsreifes Deliverable erstellen</label>
        <textarea
          required
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="z.B. Erstelle ein Entscheidungsmemo für den Partner zur Frage, ob wir dem Mandanten einen Vergleich empfehlen sollten."
          rows={3}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Erstelle Deliverable…" : "Aus Mandatswissen generieren"}
        </button>
      </form>

      {result && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="mb-2 text-xs font-medium text-emerald-700">Gerade erstellt</p>
          <div className="prose-kb text-sm text-slate-800">{result.output}</div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Bisherige KI-generierte Deliverables</h3>
        {generations.length === 0 ? (
          <p className="text-sm text-slate-400">Noch keine generiert.</p>
        ) : (
          <ul className="space-y-3">
            {generations.map((g) => (
              <li key={g.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-400">
                  {new Date(g.created_at).toLocaleString("de-DE")} · Aufgabe: {g.task}
                </p>
                <div className="prose-kb mt-2 text-sm text-slate-700 line-clamp-6">{g.output}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
