import { randomUUID } from "crypto";
import { CorridorAction, EmergencyEvent, EmergencyPlan, Junction } from "./types";

// Simplified corridor graph between known junctions
const corridorGraph: Record<string, string[]> = {
  j1: ["j2", "j6"],
  j2: ["j1", "j4", "j5"],
  j3: ["j4", "j10"],
  j4: ["j2", "j3", "j5"],
  j5: ["j2", "j4"],
  j6: ["j1", "j7"],
  j7: ["j6", "j11"],
  j8: ["j5"],
  j9: ["j5"],
  j10: ["j3"],
  j11: ["j7"],
  j12: ["j3", "j4"],
};

const reconstructPath = (cameFrom: Record<string, string | null>, end: string): string[] => {
  const path: string[] = [];
  let current: string | null = end;
  while (current) {
    path.unshift(current);
    current = cameFrom[current];
  }
  return path;
};

// Breadth-first search for shortest hop path
const shortestPath = (start: string, goal: string): string[] => {
  const queue: string[] = [start];
  const cameFrom: Record<string, string | null> = { [start]: null };

  while (queue.length) {
    const node = queue.shift()!;
    if (node === goal) return reconstructPath(cameFrom, goal);
    for (const neighbor of corridorGraph[node] || []) {
      if (!(neighbor in cameFrom)) {
        cameFrom[neighbor] = node;
        queue.push(neighbor);
      }
    }
  }

  return [];
};

export const planEmergencyCorridor = (
  type: EmergencyEvent["type"],
  origin: string,
  destination: string,
  junctions: Junction[]
): EmergencyPlan | null => {
  const route = shortestPath(origin, destination);
  if (route.length === 0) return null;

  const event: EmergencyEvent = {
    id: randomUUID(),
    type,
    origin,
    destination,
    status: "active",
    route,
    startedAt: new Date().toISOString(),
  };

  const corridor: CorridorAction[] = route.map((junctionId, idx) => {
    const j = junctions.find((x) => x.id === junctionId);
    return {
      junctionId,
      action: idx === 0 ? "Hold green for departure" : "Preempt to green on approach",
      durationSec: j?.congestionLevel === "severe" ? 90 : j?.congestionLevel === "heavy" ? 60 : 45,
    };
  });

  return { event, corridor };
};

