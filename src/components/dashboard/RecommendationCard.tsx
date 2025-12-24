import { Check, X, Sparkles, Clock, Fuel, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRecommendation } from "@/lib/trafficData";
import { useState } from "react";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  role?: "ops" | "planner" | "admin";
}

export const RecommendationCard = ({
  recommendation,
  onAccept,
  onReject,
  role = "ops",
}: RecommendationCardProps) => {
  const [expanded, setExpanded] = useState(false);

  if (recommendation.status !== "pending") return null;

  return (
    <div className="glass rounded-xl border border-primary/20 hover:border-primary/40">
      <div className="p-4">
        <div className="flex gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-primary font-medium">AI Recommendation</p>
            <h4 className="text-sm font-medium">{recommendation.junctionName}</h4>
          </div>
        </div>

        <p className="text-sm font-medium mb-2">{recommendation.action}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline mb-2"
        >
          {expanded ? "Hide reasoning" : "Show AI reasoning"}
        </button>

        {expanded && (
          <div className="text-xs bg-secondary/50 rounded-lg p-3 mb-3">
            {recommendation.reasoning}
          </div>
        )}

        {/* ✅ Explainability Layer */}
        {recommendation.explanation?.length && (
          <div className="text-xs bg-primary/5 border border-primary/20 rounded-lg p-3 mb-3">
            <p className="font-medium text-primary mb-1">Why this action?</p>
            <p className="text-muted-foreground">
              {recommendation.explanation[0].text}
            </p>
          </div>
        )}

        {/* Expected Impact */}
        <div className="flex gap-4 mb-4 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-info" />
            -{recommendation.expectedImpact.travelTimeReduction}% time
          </div>
          <div className="flex items-center gap-1">
            <Fuel className="w-3.5 h-3.5 text-warning" />
            -{recommendation.expectedImpact.fuelSavings}% fuel
          </div>
          <div className="flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5 text-success" />
            -{recommendation.expectedImpact.emissionReduction}% CO₂
          </div>
        </div>

        {/* Actions (role-aware) */}
        {role !== "planner" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-success hover:bg-success/90"
              onClick={() => onAccept(recommendation.id)}
            >
              <Check className="w-4 h-4" /> Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onReject(recommendation.id)}
            >
              <X className="w-4 h-4" /> Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
