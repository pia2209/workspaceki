import { NextResponse } from "next/server";
import { buildKnowledgeBaseBlock, generateDeliverable, currentModel } from "@/lib/ai";
import { describeAiError } from "@/lib/ai-error";
import { getProject, listItems, saveGeneration } from "@/lib/repo";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "project not found" }, { status: 404 });

  const body = await request.json();
  if (!body.instructions || typeof body.instructions !== "string") {
    return NextResponse.json({ error: "instructions is required" }, { status: 400 });
  }

  try {
    const items = listItems(id);
    const kb = buildKnowledgeBaseBlock(items);
    const output = await generateDeliverable(kb, body.instructions);
    const generation = saveGeneration({
      project_id: id,
      kind: "deliverable",
      input_item_ids: kb.itemIds,
      task: body.instructions,
      output,
      model: currentModel(),
      redaction_applied: kb.redactionApplied,
    });
    return NextResponse.json({ generation });
  } catch (err) {
    return NextResponse.json({ error: describeAiError(err) }, { status: 502 });
  }
}
