import { randomUUID } from "crypto";
import { AuditLog } from "./types";
import { saveAuditLog } from "./persistence";
import { Role } from "./auth";

export const recordRecommendationAudit = (
  recommendationId: string,
  action: "accepted" | "rejected",
  role: Role,
  explanation: string
) => {
  const log: AuditLog = {
    id: randomUUID(),
    entity: "recommendation",
    entityId: recommendationId,
    action,
    role,
    explanation,
    timestamp: new Date().toISOString(),
  };

  saveAuditLog(log);
};
