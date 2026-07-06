import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/lib/repo";

export async function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const project = createProject({
    name: body.name,
    description: body.description ?? "",
    owner: body.owner ?? "",
    status: body.status,
    file_number: body.file_number ?? null,
    client_name: body.client_name ?? null,
    practice_area: body.practice_area ?? null,
    lead_partner: body.lead_partner ?? null,
  });
  return NextResponse.json({ project }, { status: 201 });
}
