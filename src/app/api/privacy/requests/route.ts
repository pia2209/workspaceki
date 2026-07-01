import { NextResponse } from "next/server";
import { createDsr, listDsr } from "@/lib/repo";

export async function GET() {
  return NextResponse.json({ requests: listDsr() });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.subject_email || !["access", "erasure", "rectification"].includes(body.request_type)) {
    return NextResponse.json({ error: "subject_email and a valid request_type are required" }, { status: 400 });
  }
  const dsr = createDsr({ subject_email: body.subject_email, request_type: body.request_type, notes: body.notes });
  return NextResponse.json({ request: dsr }, { status: 201 });
}
