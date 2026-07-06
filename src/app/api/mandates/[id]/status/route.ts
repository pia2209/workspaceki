import { NextResponse } from "next/server";
import { buildKnowledgeBaseBlock, generateMandateStatusSummary, currentModel } from "@/lib/ai";
import { describeAiError } from "@/lib/ai-error";
import { getMandate, listItems, saveGeneration, saveMandateAiSummary } from "@/lib/repo";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mandate = getMandate(id);
  if (!mandate) return NextResponse.json({ error: "mandate not found" }, { status: 404 });

  try {
    const items = listItems(id);
    const kb = buildKnowledgeBaseBlock(items);
    const { summary, health } = await generateMandateStatusSummary(kb, mandate.name);
    saveMandateAiSummary(id, summary, health);
    saveGeneration({
      mandate_id: id,
      kind: "status_summary",
      input_item_ids: kb.itemIds,
      task: "status_summary",
      output: summary,
      model: currentModel(),
      redaction_applied: kb.redactionApplied,
    });
    return NextResponse.json({ summary, health });
  } catch (err) {
    return NextResponse.json({ error: describeAiError(err) }, { status: 502 });
  }
}
