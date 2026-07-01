import { NextResponse } from "next/server";
import { deleteItem, getItem } from "@/lib/repo";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { itemId } = await params;
  const item = getItem(itemId);
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });
  deleteItem(itemId);
  return NextResponse.json({ ok: true });
}
