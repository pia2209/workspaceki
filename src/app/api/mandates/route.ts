import { NextResponse } from "next/server";
import { createMandate, listMandates } from "@/lib/repo";

export async function GET() {
  return NextResponse.json({ mandates: listMandates() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const mandate = createMandate({
    name: body.name,
    description: body.description ?? "",
    owner: body.owner ?? "",
    status: body.status,
  });
  return NextResponse.json({ mandate }, { status: 201 });
}
