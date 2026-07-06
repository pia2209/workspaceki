import Link from "next/link";
import { listProjects } from "@/lib/repo";
import { HealthBadge, ProjectStatusBadge, PracticeAreaBadge } from "@/components/StatusBadge";
import { NewProjectForm } from "@/components/NewProjectForm";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = listProjects();

  const activeCount = projects.filter((p) => p.status === "active").length;
  const atRiskCount = projects.filter((p) => p.ai_health === "at_risk" || p.ai_health === "blocked").length;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mandatsübersicht</h1>
          <p className="mt-1 text-sm text-slate-500">
            Aktueller Stand aller Mandate auf einen Blick — Research, Besprechungen, Arbeitsergebnisse und Mandanten-Signale fließen hier zusammen.
          </p>
        </div>
        <NewProjectForm />
      </div>

      {projects.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Aktive Mandate</p>
            <p className="mt-1 text-2xl font-semibold">{activeCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Mit Aufmerksamkeitsbedarf</p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">{atRiskCount}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">Gesamt</p>
            <p className="mt-1 text-2xl font-semibold">{projects.length}</p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Noch keine Mandate angelegt. Legen Sie oben ein neues Mandat an, oder führen Sie <code className="rounded bg-slate-100 px-1 py-0.5">npm run seed</code> aus, um mit Beispieldaten zu starten.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="font-medium leading-tight">{project.name}</h2>
                  {project.file_number && (
                    <p className="text-xs text-slate-400 font-mono">{project.file_number}</p>
                  )}
                </div>
                <ProjectStatusBadge status={project.status} />
              </div>
              {project.client_name && (
                <p className="text-sm text-slate-600">
                  <span className="text-slate-400">Mandant:</span> {project.client_name}
                </p>
              )}
              {project.description && <p className="line-clamp-2 text-sm text-slate-500">{project.description}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
                <HealthBadge health={project.ai_health} />
                {project.practice_area && <PracticeAreaBadge area={project.practice_area} />}
              </div>
              {project.lead_partner && (
                <p className="text-xs text-slate-400">Partner: {project.lead_partner}</p>
              )}
              {project.ai_summary && <p className="line-clamp-3 text-xs text-slate-500">{project.ai_summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
