import { NextResponse } from "next/server";
import { listGenerations } from "@/lib/repo";
import type { AiGeneration } from "@/lib/types";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind") as AiGeneration["kind"] | null;
  return NextResponse.json({ generations: listGenerations(id, kind ?? undefined) });
}
