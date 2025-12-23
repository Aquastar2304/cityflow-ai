import { AIRecommendation, Junction, Prediction } from "./types";
import { randomUUID } from "crypto";

const hasPendingForJunction = (recs: AIRecommendation[], junctionId: string) =>
  recs.some((r) => r.junctionId === junctionId && r.status === "pending");

export const generateRecommendations = (
  junctions: Junction[],
  predictions: Prediction[],
  existing: AIRecommendation[]
): AIRecommendation[] => {
  const newRecs: AIRecommendation[] = [];

  // Prioritize junctions with severe or heavy predicted congestion and no pending rec
  const hotPredictions = predictions
    .filter((p) => (p.predictedCongestion === "severe" || p.predictedCongestion === "heavy"))
    .sort((a, b) => b.projectedQueueLength - a.projectedQueueLength)
    .slice(0, 5);

  hotPredictions.forEach((pred) => {
    if (hasPendingForJunction(existing, pred.junctionId)) return;

    const action =
      pred.predictedCongestion === "severe"
        ? "Coordinate corridor and extend critical approach by 25s"
        : "Extend dominant approach by 15s and balance offsets";

    const reasoning = `Forecast shows ${pred.predictedCongestion} congestion in ${pred.horizonMinutes} minutes at ${pred.junctionName} with projected queue ${pred.projectedQueueLength}m. Applying pre-emptive timing changes to prevent spillback.`;

    newRecs.push({
      id: randomUUID(),
      junctionId: pred.junctionId,
      junctionName: pred.junctionName,
      action,
      reasoning,
      expectedImpact: {
        travelTimeReduction: pred.predictedCongestion === "severe" ? 22 : 15,
        fuelSavings: pred.predictedCongestion === "severe" ? 16 : 10,
        emissionReduction: pred.predictedCongestion === "severe" ? 18 : 12,
      },
      status: "pending",
    });
  });

  return [...newRecs, ...existing].slice(0, 10);
};

