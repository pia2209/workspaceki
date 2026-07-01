import { NextResponse } from "next/server";
import { deleteItem, listExpiredItems } from "@/lib/repo";
import { logAudit } from "@/lib/privacy";

// DSGVO Art. 5(1)(e) — Speicherbegrenzung (storage limitation).
// Deletes knowledge items whose retention_until date has passed.
export async function POST() {
  const expired = listExpiredItems();
  for (const item of expired) deleteItem(item.id);
  logAudit("retention.sweep", "knowledge_item", "", { deleted_count: expired.length });
  return NextResponse.json({ deleted_count: expired.length });
}

export async function GET() {
  const expired = listExpiredItems();
  return NextResponse.json({ expired_count: expired.length, items: expired });
}
