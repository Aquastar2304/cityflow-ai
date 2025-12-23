import { Junction, Prediction, CongestionLevel } from "./types";

const congestionFromQueue = (queue: number): CongestionLevel => {
  if (queue > 380) return "severe";
  if (queue > 200) return "heavy";
  if (queue > 90) return "moderate";
  return "low";
};

export const predictCongestion = (
  junctions: Junction[],
  horizonMinutes = 30
): Prediction[] => {
  return junctions.map((j) => {
    // Simple heuristic forecast: trend grows with current load and horizon
    const growthFactor = 1 + Math.min(horizonMinutes / 60, 1) * 0.35;
    const projectedQueueLength = Math.round(j.queueLength * growthFactor + Math.random() * 20);
    const projectedVehicleCount = Math.round(j.vehicleCount * (1 + (growthFactor - 1) / 2));
    const predictedCongestion = congestionFromQueue(projectedQueueLength);
    const confidence = Math.min(0.6 + (growthFactor - 1), 0.9);

    return {
      junctionId: j.id,
      junctionName: j.name,
      horizonMinutes,
      predictedCongestion,
      projectedVehicleCount,
      projectedQueueLength,
      confidence: parseFloat(confidence.toFixed(2)),
      reason: `Projected queue growth based on current load and ${horizonMinutes}m horizon.`,
    };
  });
};

