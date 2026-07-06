const HEALTH_STYLES: Record<string, string> = {
  on_track: "bg-emerald-100 text-emerald-800",
  at_risk: "bg-amber-100 text-amber-800",
  blocked: "bg-red-100 text-red-800",
};

const HEALTH_LABELS: Record<string, string> = {
  on_track: "Im Plan",
  at_risk: "Aufmerksamkeit",
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

const PROJECT_STATUS_LABELS: Record<string, string> = {
  active: "Aktiv",
  on_hold: "Ruhend",
  completed: "Abgeschlossen",
  archived: "Archiviert",
};

export function ProjectStatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
      {PROJECT_STATUS_LABELS[status] ?? status}
    </span>
  );
}

const PRACTICE_AREA_LABELS: Record<string, string> = {
  corporate: "Gesellschaftsrecht",
  litigation: "Prozessführung",
  ip: "IP / IT",
  employment: "Arbeitsrecht",
  tax: "Steuerrecht",
  real_estate: "Immobilienrecht",
  banking: "Bank- & Kapitalmarkt",
  regulatory: "Regulierung",
  other: "Sonstiges",
};

const PRACTICE_AREA_STYLES: Record<string, string> = {
  corporate: "bg-blue-50 text-blue-700",
  litigation: "bg-purple-50 text-purple-700",
  ip: "bg-cyan-50 text-cyan-700",
  employment: "bg-orange-50 text-orange-700",
  tax: "bg-lime-50 text-lime-700",
  real_estate: "bg-stone-100 text-stone-700",
  banking: "bg-emerald-50 text-emerald-700",
  regulatory: "bg-rose-50 text-rose-700",
  other: "bg-slate-100 text-slate-600",
};

export function PracticeAreaBadge({ area }: { area: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRACTICE_AREA_STYLES[area] ?? "bg-slate-100 text-slate-600"}`}>
      {PRACTICE_AREA_LABELS[area] ?? area}
    </span>
  );
}

const ITEM_TYPE_LABELS: Record<string, string> = {
  research: "Recherche",
  meeting: "Besprechung",
  deliverable: "Arbeitsergebnis",
  stakeholder_signal: "Mandanten-Signal",
};

export function ItemTypeBadge({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
      {ITEM_TYPE_LABELS[type] ?? type}
    </span>
  );
}
