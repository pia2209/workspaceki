import { NextResponse } from "next/server";
import { createItem, getMandate, listItems } from "@/lib/repo";
import type { ItemType } from "@/lib/types";

const VALID_TYPES: ItemType[] = ["research", "meeting", "deliverable", "stakeholder_signal"];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json({ items: listItems(id) });
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = getMandate(id);
  if (!mandate) return NextResponse.json({ error: "mandate not found" }, { status: 404 });

  const body = await request.json();
  if (!body.title || !body.content || !VALID_TYPES.includes(body.type)) {
    return NextResponse.json({ error: "title, content and a valid type are required" }, { status: 400 });
  }

  const item = createItem({
    mandate_id: id,
    type: body.type,
    title: body.title,
    content: body.content,
    author: body.author ?? "",
    subject_email: body.subject_email ?? null,
    source: body.source ?? "",
    occurred_at: body.occurred_at ?? new Date().toISOString(),
    legal_basis: body.legal_basis,
    retention_until: body.retention_until ?? null,
    pii_redact: body.pii_redact !== false,
  });
  return NextResponse.json({ item }, { status: 201 });
}
