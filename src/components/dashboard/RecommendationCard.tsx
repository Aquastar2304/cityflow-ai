import { Check, X, Sparkles, Clock, Fuel, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRecommendation } from "@/lib/trafficData";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const RecommendationCard = ({ 
  recommendation, 
  onAccept, 
  onReject 
}: RecommendationCardProps) => {
  const [expanded, setExpanded] = useState(false);

  if (recommendation.status !== "pending") return null;

  return (
    <div className="glass rounded-xl border border-primary/20 overflow-hidden transition-all duration-300 hover:border-primary/40">
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium mb-1">
              AI Recommendation
            </p>
            <h4 className="font-medium text-sm text-foreground">
              {recommendation.junctionName}
            </h4>
          </div>
        </div>

        <p className="text-sm font-medium text-foreground mb-2">
          {recommendation.action}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-primary hover:underline mb-3"
        >
          {expanded ? "Hide reasoning" : "Show AI reasoning"}
        </button>

        {expanded && (
          <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3 mb-3 animate-slide-up">
            {recommendation.reasoning}
          </div>
        )}

        {/* Expected Impact */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-info" />
            <span className="text-muted-foreground">
              <span className="text-info font-medium">-{recommendation.expectedImpact.travelTimeReduction}%</span> time
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Fuel className="w-3.5 h-3.5 text-warning" />
            <span className="text-muted-foreground">
              <span className="text-warning font-medium">-{recommendation.expectedImpact.fuelSavings}%</span> fuel
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Leaf className="w-3.5 h-3.5 text-success" />
            <span className="text-muted-foreground">
              <span className="text-success font-medium">-{recommendation.expectedImpact.emissionReduction}%</span> CO₂
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-success text-success-foreground hover:bg-success/90"
            onClick={() => onAccept(recommendation.id)}
          >
            <Check className="w-4 h-4" />
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onReject(recommendation.id)}
          >
            <X className="w-4 h-4" />
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
};
