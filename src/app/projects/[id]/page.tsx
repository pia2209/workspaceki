import { notFound } from "next/navigation";
import { getProject, listItems, listGenerations } from "@/lib/repo";
import { ProjectHub } from "@/components/ProjectHub";

export const dynamic = "force-dynamic";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  const items = listItems(id);
  const deliverableGenerations = listGenerations(id, "deliverable");
  const qaGenerations = listGenerations(id, "qa");

  return (
    <ProjectHub
      project={project}
      items={items}
      deliverableGenerations={deliverableGenerations}
      qaGenerations={qaGenerations}
    />
  );
}
