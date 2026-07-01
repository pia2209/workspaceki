import { getDb, newId, nowIso, toPlain, toPlainArray } from "./db";
import { logAudit } from "./privacy";
import type {
  Project,
  KnowledgeItem,
  AiGeneration,
  AuditLogEntry,
  DataSubjectRequest,
  ItemType,
  LegalBasis,
  ProjectStatus,
} from "./types";

// --- Projects ---------------------------------------------------------

export function listProjects(): Project[] {
  const db = getDb();
  return toPlainArray<Project>(db.prepare(`SELECT * FROM projects ORDER BY updated_at DESC`).all());
}

export function getProject(id: string): Project | undefined {
  const db = getDb();
  return toPlain<Project | undefined>(db.prepare(`SELECT * FROM projects WHERE id = ?`).get(id));
}

export function createProject(input: { name: string; description: string; owner: string; status?: ProjectStatus }): Project {
  const db = getDb();
  const id = newId("proj");
  const now = nowIso();
  db.prepare(
    `INSERT INTO projects (id, name, description, owner, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, input.name, input.description, input.owner, input.status ?? "active", now, now);
  logAudit("project.create", "project", id, { name: input.name });
  return getProject(id)!;
}

export function touchProject(id: string): void {
  getDb().prepare(`UPDATE projects SET updated_at = ? WHERE id = ?`).run(nowIso(), id);
}

export function saveProjectAiSummary(id: string, summary: string, health: string): void {
  const db = getDb();
  db.prepare(
    `UPDATE projects SET ai_summary = ?, ai_health = ?, ai_summary_generated_at = ?, updated_at = ? WHERE id = ?`
  ).run(summary, health, nowIso(), nowIso(), id);
}

export function deleteProject(id: string): void {
  const db = getDb();
  db.prepare(`DELETE FROM projects WHERE id = ?`).run(id);
  logAudit("project.delete", "project", id);
}

// --- Knowledge items ----------------------------------------------------

export function listItems(projectId: string): KnowledgeItem[] {
  const db = getDb();
  return toPlainArray<KnowledgeItem>(
    db.prepare(`SELECT * FROM knowledge_items WHERE project_id = ? ORDER BY occurred_at DESC`).all(projectId)
  );
}

export function getItem(id: string): KnowledgeItem | undefined {
  return toPlain<KnowledgeItem | undefined>(getDb().prepare(`SELECT * FROM knowledge_items WHERE id = ?`).get(id));
}

export function createItem(input: {
  project_id: string;
  type: ItemType;
  title: string;
  content: string;
  author: string;
  subject_email?: string | null;
  source: string;
  occurred_at: string;
  legal_basis?: LegalBasis;
  retention_until?: string | null;
  pii_redact?: boolean;
}): KnowledgeItem {
  const db = getDb();
  const id = newId("item");
  db.prepare(
    `INSERT INTO knowledge_items
      (id, project_id, type, title, content, author, subject_email, source, occurred_at, legal_basis, retention_until, pii_redact, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.project_id,
    input.type,
    input.title,
    input.content,
    input.author,
    input.subject_email ?? null,
    input.source,
    input.occurred_at,
    input.legal_basis ?? "legitimate_interest",
    input.retention_until ?? null,
    input.pii_redact === false ? 0 : 1,
    nowIso()
  );
  touchProject(input.project_id);
  logAudit("item.create", "knowledge_item", id, { project_id: input.project_id, type: input.type });
  return getItem(id)!;
}

export function deleteItem(id: string): void {
  const item = getItem(id);
  getDb().prepare(`DELETE FROM knowledge_items WHERE id = ?`).run(id);
  logAudit("item.delete", "knowledge_item", id, { project_id: item?.project_id });
}

export function findItemsBySubject(email: string): KnowledgeItem[] {
  return toPlainArray<KnowledgeItem>(
    getDb().prepare(`SELECT * FROM knowledge_items WHERE subject_email = ? OR author = ?`).all(email, email)
  );
}

export function listExpiredItems(): KnowledgeItem[] {
  const now = nowIso();
  return toPlainArray<KnowledgeItem>(
    getDb().prepare(`SELECT * FROM knowledge_items WHERE retention_until IS NOT NULL AND retention_until <= ?`).all(now)
  );
}

// --- AI generations -------------------------------------------------------

export function saveGeneration(input: {
  project_id: string;
  kind: AiGeneration["kind"];
  input_item_ids: string[];
  task: string;
  output: string;
  model: string;
  redaction_applied: boolean;
}): AiGeneration {
  const db = getDb();
  const id = newId("gen");
  db.prepare(
    `INSERT INTO ai_generations (id, project_id, kind, input_item_ids, task, output, model, redaction_applied, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.project_id,
    input.kind,
    JSON.stringify(input.input_item_ids),
    input.task,
    input.output,
    input.model,
    input.redaction_applied ? 1 : 0,
    nowIso()
  );
  logAudit("ai.generate", "ai_generation", id, {
    project_id: input.project_id,
    kind: input.kind,
    model: input.model,
    input_item_count: input.input_item_ids.length,
    redaction_applied: input.redaction_applied,
  });
  return toPlain<AiGeneration>(db.prepare(`SELECT * FROM ai_generations WHERE id = ?`).get(id));
}

export function listGenerations(projectId: string, kind?: AiGeneration["kind"]): AiGeneration[] {
  const db = getDb();
  if (kind) {
    return toPlainArray<AiGeneration>(
      db.prepare(`SELECT * FROM ai_generations WHERE project_id = ? AND kind = ? ORDER BY created_at DESC`).all(projectId, kind)
    );
  }
  return toPlainArray<AiGeneration>(
    db.prepare(`SELECT * FROM ai_generations WHERE project_id = ? ORDER BY created_at DESC`).all(projectId)
  );
}

// --- Audit log --------------------------------------------------------

export function listAuditLog(limit = 200): AuditLogEntry[] {
  return toPlainArray<AuditLogEntry>(getDb().prepare(`SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?`).all(limit));
}

// --- Data subject requests (DSGVO Art. 15 / 17 / 16) --------------------

export function createDsr(input: { subject_email: string; request_type: DataSubjectRequest["request_type"]; notes?: string }): DataSubjectRequest {
  const db = getDb();
  const id = newId("dsr");
  db.prepare(
    `INSERT INTO data_subject_requests (id, subject_email, request_type, notes, created_at) VALUES (?, ?, ?, ?, ?)`
  ).run(id, input.subject_email, input.request_type, input.notes ?? "", nowIso());
  logAudit("dsr.create", "data_subject_request", id, { subject_email: input.subject_email, type: input.request_type });
  return toPlain<DataSubjectRequest>(db.prepare(`SELECT * FROM data_subject_requests WHERE id = ?`).get(id));
}

export function listDsr(): DataSubjectRequest[] {
  return toPlainArray<DataSubjectRequest>(getDb().prepare(`SELECT * FROM data_subject_requests ORDER BY created_at DESC`).all());
}

export function completeDsr(id: string): void {
  getDb()
    .prepare(`UPDATE data_subject_requests SET status = 'completed', completed_at = ? WHERE id = ?`)
    .run(nowIso(), id);
  logAudit("dsr.complete", "data_subject_request", id);
}
