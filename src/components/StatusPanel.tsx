"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { KnowledgeItem, Project } from "@/lib/types";
import { HealthBadge, ItemTypeBadge } from "@/components/StatusBadge";

export function StatusPanel({ project, items }: { project: Project; items: KnowledgeItem[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshStatus() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${project.id}/status`, { method: "POST" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Fehler bei der Status-Analyse");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const timeline = [...items].sort((a, b) => (a.occurred_at < b.occurred_at ? 1 : -1));

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HealthBadge health={project.ai_health} />
            {project.ai_summary_generated_at && (
              <span className="text-xs text-slate-400">
                Analyse vom {new Date(project.ai_summary_generated_at).toLocaleString("de-DE")}
              </span>
            )}
          </div>
          <button
            onClick={refreshStatus}
            disabled={loading}
            className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Analysiere…" : "Mandatsstatus aktualisieren"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">
          {project.ai_summary ?? "Noch keine KI-Statusanalyse erstellt. Klicken Sie oben auf \"Mandatsstatus aktualisieren\", sobald Mandatswissen vorhanden ist."}
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700">Mandatschronik</h3>
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-400">Noch keine Einträge vorhanden.</p>
        ) : (
          <ol className="space-y-3 border-l border-slate-200 pl-4">
            {timeline.map((item) => (
              <li key={item.id} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-slate-300" />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{item.occurred_at.slice(0, 10)}</span>
                  <ItemTypeBadge type={item.type} />
                </div>
                <p className="text-sm font-medium">{item.title}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
