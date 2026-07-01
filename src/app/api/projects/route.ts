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
  });
  return NextResponse.json({ project }, { status: 201 });
}
