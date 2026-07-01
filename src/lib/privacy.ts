import { getDb, newId, nowIso } from "./db";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}\b/g;
const IBAN_RE = /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/g;

/**
 * Regex-based PII redaction applied before any content leaves the app for
 * third-party AI processing (DSGVO Art. 25 privacy by design / Art. 32
 * pseudonymization). This is a pragmatic best-effort pass, not a full
 * NER/PII pipeline — flagged as a known limitation in the README.
 */
export function redactPii(text: string): string {
  return text
    .replace(EMAIL_RE, "[REDACTED_EMAIL]")
    .replace(IBAN_RE, "[REDACTED_IBAN]")
    .replace(PHONE_RE, "[REDACTED_PHONE]");
}

export function logAudit(action: string, entityType: string, entityId: string, details: Record<string, unknown> = {}, actor = "system") {
  const db = getDb();
  db.prepare(
    `INSERT INTO audit_log (id, actor, action, entity_type, entity_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(newId("audit"), actor, action, entityType, entityId, JSON.stringify(details), nowIso());
}
