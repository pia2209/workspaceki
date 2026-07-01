export type ProjectStatus = "active" | "on_hold" | "completed" | "archived";
export type AiHealth = "on_track" | "at_risk" | "blocked" | null;
export type ItemType = "research" | "meeting" | "deliverable" | "stakeholder_signal";
export type LegalBasis = "consent" | "contract" | "legitimate_interest" | "legal_obligation";

export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  status: ProjectStatus;
  ai_health: AiHealth;
  ai_summary: string | null;
  ai_summary_generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeItem {
  id: string;
  project_id: string;
  type: ItemType;
  title: string;
  content: string;
  author: string;
  subject_email: string | null;
  source: string;
  occurred_at: string;
  legal_basis: LegalBasis;
  retention_until: string | null;
  pii_redact: number;
  created_at: string;
}

export interface AiGeneration {
  id: string;
  project_id: string;
  kind: "status_summary" | "deliverable" | "qa";
  input_item_ids: string;
  task: string;
  output: string;
  model: string;
  redaction_applied: number;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  created_at: string;
}

export interface DataSubjectRequest {
  id: string;
  subject_email: string;
  request_type: "access" | "erasure" | "rectification";
  status: "open" | "completed";
  notes: string;
  created_at: string;
  completed_at: string | null;
}
