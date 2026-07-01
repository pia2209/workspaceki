import { NextResponse } from "next/server";
import { completeDsr, findItemsBySubject } from "@/lib/repo";
import { logAudit } from "@/lib/privacy";

// DSGVO Art. 15 — Recht auf Auskunft (right of access).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const dsrId = searchParams.get("dsr_id");
  if (!email) return NextResponse.json({ error: "email query param is required" }, { status: 400 });

  const items = findItemsBySubject(email);
  logAudit("dsr.export", "data_subject_request", dsrId ?? "", { subject_email: email, item_count: items.length });
  if (dsrId) completeDsr(dsrId);

  return NextResponse.json({
    subject_email: email,
    exported_at: new Date().toISOString(),
    item_count: items.length,
    items,
  });
}
