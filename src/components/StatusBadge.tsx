const HEALTH_STYLES: Record<string, string> = {
  on_track: "bg-emerald-100 text-emerald-800",
  at_risk: "bg-amber-100 text-amber-800",
  blocked: "bg-red-100 text-red-800",
};

const HEALTH_LABELS: Record<string, string> = {
  on_track: "Im Plan",
  at_risk: "Risiko",
  blocked: "Blockiert",
};

export function HealthBadge({ health }: { health: string | null }) {
  if (!health) {
    return (
      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
        Noch keine Analyse
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${HEALTH_STYLES[health] ?? "bg-slate-100 text-slate-600"}`}>
      {HEALTH_LABELS[health] ?? health}
    </span>
  );
}

const MANDATE_STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  on_hold: "Pausiert",
  completed: "Abgeschlossen",
  archived: "Archiviert",
};

export function MandateStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {MANDATE_STATUS_LABELS[status] ?? status}
    </span>
  );
}

const ITEM_TYPE_LABELS: Record<string, string> = {
  research: "Research",
  meeting: "Meeting",
  deliverable: "Deliverable",
  stakeholder_signal: "Stakeholder-Signal",
};

export function ItemTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
      {ITEM_TYPE_LABELS[type] ?? type}
    </span>
  );
}
