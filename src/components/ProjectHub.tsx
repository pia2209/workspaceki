"use client";

import { useState } from "react";
import type { AiGeneration, KnowledgeItem, Project } from "@/lib/types";
import { ProjectStatusBadge } from "@/components/StatusBadge";
import { StatusPanel } from "@/components/StatusPanel";
import { AddItemForm } from "@/components/AddItemForm";
import { ItemList } from "@/components/ItemList";
import { GenerateDeliverableForm } from "@/components/GenerateDeliverableForm";
import { AskAiForm } from "@/components/AskAiForm";

const TABS = [
  { key: "overview", label: "Übersicht" },
  { key: "research", label: "Research" },
  { key: "meeting", label: "Meetings" },
  { key: "deliverable", label: "Deliverables" },
  { key: "stakeholder_signal", label: "Stakeholder-Signale" },
  { key: "ask", label: "Frage an die KI" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function ProjectHub({
  project,
  items,
  deliverableGenerations,
  qaGenerations,
}: {
  project: Project;
  items: KnowledgeItem[];
  deliverableGenerations: AiGeneration[];
  qaGenerations: AiGeneration[];
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  const byType = (type: KnowledgeItem["type"]) => items.filter((i) => i.type === type);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <ProjectStatusBadge status={project.status} />
        </div>
        {project.description && <p className="mt-1 text-sm text-slate-500">{project.description}</p>}
        {project.owner && <p className="mt-1 text-xs text-slate-400">Verantwortlich: {project.owner}</p>}
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-t-md px-3 py-2 text-sm font-medium ${
              tab === t.key ? "border-b-2 border-slate-900 text-slate-900" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && <StatusPanel project={project} items={items} />}

      {tab === "research" && (
        <div className="space-y-4">
          <AddItemForm projectId={project.id} type="research" />
          <ItemList items={byType("research")} />
        </div>
      )}

      {tab === "meeting" && (
        <div className="space-y-4">
          <AddItemForm projectId={project.id} type="meeting" />
          <ItemList items={byType("meeting")} />
        </div>
      )}

      {tab === "deliverable" && (
        <div className="space-y-8">
          <GenerateDeliverableForm projectId={project.id} generations={deliverableGenerations} />
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Frühere Arbeitsergebnisse (Upload)</h3>
            <AddItemForm projectId={project.id} type="deliverable" />
            <div className="mt-3">
              <ItemList items={byType("deliverable")} />
            </div>
          </div>
        </div>
      )}

      {tab === "stakeholder_signal" && (
        <div className="space-y-4">
          <AddItemForm projectId={project.id} type="stakeholder_signal" />
          <ItemList items={byType("stakeholder_signal")} />
        </div>
      )}

      {tab === "ask" && <AskAiForm projectId={project.id} generations={qaGenerations} />}
    </div>
  );
}
