import { listAuditLog, listDsr } from "@/lib/repo";
import { isPiiRedactionEnabled, currentModel } from "@/lib/ai";
import { PrivacyCenter } from "@/components/PrivacyCenter";

export const dynamic = "force-dynamic";

export default function PrivacyPage() {
  const auditLog = listAuditLog();
  const requests = listDsr();

  return (
    <PrivacyCenter
      auditLog={auditLog}
      requests={requests}
      piiRedactionEnabled={isPiiRedactionEnabled()}
      model={currentModel()}
    />
  );
}
