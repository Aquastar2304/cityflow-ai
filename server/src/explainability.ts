import { AIRecommendation, Prediction, Explanation, ExplanationLevel } from "./types";
import { Role } from "./auth";

const levelFromRole = (role?: Role): ExplanationLevel => {
  if (role === "admin") return "technical";
  if (role === "planner") return "detailed";
  return "short";
};

export const explainRecommendation = (
  rec: AIRecommendation,
  prediction?: Prediction,
  role?: Role
): Explanation[] => {
  const explanations: Explanation[] = [];

  // SHORT
  explanations.push({
    level: "short",
    text: `Traffic congestion is expected to rise at ${rec.junctionName}, so a proactive signal adjustment is recommended.`,
  });

  // DETAILED
  explanations.push({
    level: "detailed",
    text: `Forecast models indicate ${prediction?.predictedCongestion ?? "increased"} congestion within ${
      prediction?.horizonMinutes ?? 30
    } minutes. The projected queue length exceeds safe thresholds, so extending and coordinating green phases can reduce spillback.`,
  });

  // TECHNICAL
  explanations.push({
    level: "technical",
    text: `The optimizer detected predicted congestion >= HEAVY with projected queue ${
      prediction?.projectedQueueLength ?? "N/A"
    }. Rule R-EXT-GREEN was triggered to minimize queue propagation and reduce travel delay.`,
  });

  const level = levelFromRole(role);
  return explanations.filter((e) => e.level === level);
};
