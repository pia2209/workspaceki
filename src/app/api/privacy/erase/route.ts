import { NextResponse } from "next/server";
import { completeDsr, deleteItem, findItemsBySubject } from "@/lib/repo";
import { logAudit } from "@/lib/privacy";

// DSGVO Art. 17 — Recht auf Löschung (right to erasure).
export async function POST(request: Request) {
  const body = await request.json();
  const email = body.email as string | undefined;
  const dsrId = body.dsr_id as string | undefined;
  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const items = findItemsBySubject(email);
  for (const item of items) deleteItem(item.id);
  logAudit("dsr.erase", "data_subject_request", dsrId ?? "", { subject_email: email, deleted_count: items.length });
  if (dsrId) completeDsr(dsrId);

  return NextResponse.json({ deleted_count: items.length });
}
