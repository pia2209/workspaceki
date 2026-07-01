import { NextResponse } from "next/server";
import { listAuditLog } from "@/lib/repo";

export async function GET() {
  return NextResponse.json({ entries: listAuditLog() });
}
