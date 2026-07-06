import Link from "next/link";
import { listMandates } from "@/lib/repo";
import { HealthBadge, MandateStatusBadge } from "@/components/StatusBadge";
import { NewMandateForm } from "@/components/NewMandateForm";

export const dynamic = "force-dynamic";

export default function Home() {
  const mandates = listMandates();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mandate</h1>
          <p className="mt-1 text-sm text-slate-500">
            Aktueller Stand aller Mandate auf einen Blick — Research, Meetings, Deliverables und Stakeholder-Signale laufen hier zusammen, damit Partner jederzeit entscheidungsreif sind.
          </p>
        </div>
        <NewMandateForm />
      </div>

      {mandates.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Noch keine Mandate angelegt. Lege oben ein Mandat an, oder führe <code className="rounded bg-slate-100 px-1 py-0.5">npm run seed</code> aus, um mit Beispieldaten zu starten.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mandates.map((mandate) => (
            <Link
              key={mandate.id}
              href={`/mandates/${mandate.id}`}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-medium leading-tight">{mandate.name}</h2>
                <MandateStatusBadge status={mandate.status} />
              </div>
              {mandate.description && <p className="line-clamp-2 text-sm text-slate-500">{mandate.description}</p>}
              <div className="mt-auto flex items-center justify-between pt-2">
                <HealthBadge health={mandate.ai_health} />
                {mandate.owner && <span className="text-xs text-slate-400">{mandate.owner}</span>}
              </div>
              {mandate.ai_summary && <p className="line-clamp-3 text-xs text-slate-500">{mandate.ai_summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
