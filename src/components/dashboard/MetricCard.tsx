import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
}

export const MetricCard = ({ 
  title, 
  value, 
  unit, 
  icon: Icon, 
  trend,
  variant = "default" 
}: MetricCardProps) => {
  const variantStyles = {
    default: "border-border",
    primary: "border-primary/30 bg-primary/5",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  };

  const iconStyles = {
    default: "text-muted-foreground bg-secondary",
    primary: "text-primary bg-primary/20",
    success: "text-success bg-success/20",
    warning: "text-warning bg-warning/20",
    destructive: "text-destructive bg-destructive/20",
  };

  return (
    <div className={cn(
      "glass rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02]",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          iconStyles[variant]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.positive 
              ? "text-success bg-success/20" 
              : "text-destructive bg-destructive/20"
          )}>
            {trend.positive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
};
