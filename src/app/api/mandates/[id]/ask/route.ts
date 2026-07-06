import { NextResponse } from "next/server";
import { buildKnowledgeBaseBlock, askMandateQuestion, currentModel } from "@/lib/ai";
import { describeAiError } from "@/lib/ai-error";
import { getMandate, listItems, saveGeneration } from "@/lib/repo";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = getMandate(id);
  if (!mandate) return NextResponse.json({ error: "mandate not found" }, { status: 404 });

  const body = await request.json();
  if (!body.question || typeof body.question !== "string") {
    return NextResponse.json({ error: "question is required" }, { status: 400 });
  }

  try {
    const items = listItems(id);
    const kb = buildKnowledgeBaseBlock(items);
    const answer = await askMandateQuestion(kb, body.question);
    saveGeneration({
      mandate_id: id,
      kind: "qa",
      input_item_ids: kb.itemIds,
      task: body.question,
      output: answer,
      model: currentModel(),
      redaction_applied: kb.redactionApplied,
    });
    return NextResponse.json({ answer });
  } catch (err) {
    return NextResponse.json({ error: describeAiError(err) }, { status: 502 });
  }
}
