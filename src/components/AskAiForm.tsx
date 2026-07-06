"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AiGeneration } from "@/lib/types";

export function AskAiForm({ projectId, generations }: { projectId: string; generations: AiGeneration[] }) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler bei der Anfrage");
      const data = await res.json();
      setAnswer(data.answer);
      setQuestion("");
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
        <label className="block text-sm font-medium text-slate-700">Frage zum Mandat stellen</label>
        <p className="text-xs text-slate-500">Der KI-Assistent beantwortet Fragen ausschließlich auf Basis der gesammelten Mandatsinformationen.</p>
        <textarea
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="z.B. Welche Bedenken hat der Mandant zur Haftungsklausel geäußert?"
          rows={2}
          className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? "Recherchiere…" : "Frage stellen"}
        </button>
      </form>

      {answer && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4">
          <p className="whitespace-pre-wrap text-sm text-slate-800">{answer}</p>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Bisherige Fragen</h3>
        {generations.length === 0 ? (
          <p className="text-sm text-slate-400">Noch keine Fragen gestellt.</p>
        ) : (
          <ul className="space-y-3">
            {generations.map((g) => (
              <li key={g.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium">{g.task}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{g.output}</p>
                <p className="mt-2 text-xs text-slate-400">{new Date(g.created_at).toLocaleString("de-DE")}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
