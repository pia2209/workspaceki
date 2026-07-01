import { NextResponse } from "next/server";
import { buildKnowledgeBaseBlock, generateProjectStatusSummary, currentModel } from "@/lib/ai";
import { describeAiError } from "@/lib/ai-error";
import { getProject, listItems, saveGeneration, saveProjectAiSummary } from "@/lib/repo";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return NextResponse.json({ error: "project not found" }, { status: 404 });

  try {
    const items = listItems(id);
    const kb = buildKnowledgeBaseBlock(items);
    const { summary, health } = await generateProjectStatusSummary(kb, project.name);
    saveProjectAiSummary(id, summary, health);
    saveGeneration({
      project_id: id,
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
