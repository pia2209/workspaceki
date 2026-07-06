import { NextResponse } from "next/server";
import { deleteMandate, getMandate } from "@/lib/repo";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = getMandate(id);
  if (!mandate) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ mandate });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = getMandate(id);
  if (!mandate) return NextResponse.json({ error: "not found" }, { status: 404 });
  deleteMandate(id);
  return NextResponse.json({ ok: true });
}
