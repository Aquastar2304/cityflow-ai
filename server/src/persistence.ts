import fs from "fs";
import path from "path";
import { TrafficState, AuditLog } from "./types";
import { config } from "./config";

const ensureDir = (filePath: string) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

export const loadState = (fallback: TrafficState): TrafficState => {
  try {
    const filePath = path.resolve(config.dataFile);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as TrafficState;
    }
  } catch {
    // fallback
  }
  return fallback;
};

export const saveState = (state: TrafficState) => {
  const filePath = path.resolve(config.dataFile);
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
};

// 🔹 AUDIT LOGS (PHASE 5)

const auditFile = path.resolve("server/data/audit.json");

export const saveAuditLog = (log: AuditLog) => {
  ensureDir(auditFile);
  const existing = fs.existsSync(auditFile)
    ? (JSON.parse(fs.readFileSync(auditFile, "utf-8")) as AuditLog[])
    : [];
  fs.writeFileSync(auditFile, JSON.stringify([log, ...existing], null, 2), "utf-8");
};
