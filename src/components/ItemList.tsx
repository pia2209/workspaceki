"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { KnowledgeItem } from "@/lib/types";

export function ItemList({ items }: { items: KnowledgeItem[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);

  async function remove(item: KnowledgeItem) {
    if (!confirm(`"${item.title}" wirklich löschen?`)) return;
    setDeleting(item.id);
    try {
      await fetch(`/api/mandates/${item.mandate_id}/items/${item.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeleting(null);
    }
  }

  if (items.length === 0) {
    return <p className="text-sm text-slate-400">Noch keine Einträge in dieser Kategorie.</p>;
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-0.5 text-xs text-slate-400">
                {item.occurred_at.slice(0, 10)}
                {item.author ? ` · ${item.author}` : ""}
                {item.source ? ` · Quelle: ${item.source}` : ""}
                {item.pii_redact ? " · PII-Schwärzung aktiv" : ""}
              </p>
            </div>
            <button
              onClick={() => remove(item)}
              disabled={deleting === item.id}
              className="shrink-0 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              Löschen
            </button>
          </div>
          <p className="prose-kb mt-2 text-sm text-slate-600 line-clamp-6">{item.content}</p>
        </li>
      ))}
    </ul>
  );
}
