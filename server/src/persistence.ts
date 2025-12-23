import fs from "fs";
import path from "path";
import { TrafficState } from "./types";
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
  } catch (err) {
    // swallow and fall back
    // eslint-disable-next-line no-console
    console.warn("Failed to load state, using fallback.", err);
  }
  return fallback;
};

export const saveState = (state: TrafficState) => {
  const filePath = path.resolve(config.dataFile);
  ensureDir(filePath);
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2), "utf-8");
};

