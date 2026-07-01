import Link from "next/link";
import { listProjects } from "@/lib/repo";
import { HealthBadge, ProjectStatusBadge } from "@/components/StatusBadge";
import { NewProjectForm } from "@/components/NewProjectForm";

export const dynamic = "force-dynamic";

export default function Home() {
  const projects = listProjects();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projekte</h1>
          <p className="mt-1 text-sm text-slate-500">
            Aktueller Stand aller Projekte auf einen Blick — Research, Meetings, Deliverables und Stakeholder-Signale laufen hier zusammen.
          </p>
        </div>
        <NewProjectForm />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
          Noch keine Projekte angelegt. Lege oben ein Projekt an, oder führe <code className="rounded bg-slate-100 px-1 py-0.5">npm run seed</code> aus, um mit Beispieldaten zu starten.
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
                <h2 className="font-medium leading-tight">{project.name}</h2>
                <ProjectStatusBadge status={project.status} />
              </div>
              {project.description && <p className="line-clamp-2 text-sm text-slate-500">{project.description}</p>}
              <div className="mt-auto flex items-center justify-between pt-2">
                <HealthBadge health={project.ai_health} />
                {project.owner && <span className="text-xs text-slate-400">{project.owner}</span>}
              </div>
              {project.ai_summary && <p className="line-clamp-3 text-xs text-slate-500">{project.ai_summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
