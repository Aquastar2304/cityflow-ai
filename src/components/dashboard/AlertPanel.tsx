import { AlertTriangle, Siren, TrendingUp, AlertCircle } from "lucide-react";
import { Alert } from "@/lib/trafficData";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface AlertPanelProps {
  alerts: Alert[];
}

const alertTypeIcons = {
  emergency: Siren,
  congestion: AlertTriangle,
  incident: AlertCircle,
  prediction: TrendingUp,
};

const severityStyles = {
  info: "border-info/30 bg-info/5",
  warning: "border-warning/30 bg-warning/5",
  critical: "border-destructive/30 bg-destructive/5 traffic-pulse",
};

const severityIconBg = {
  info: "bg-info/20 text-info",
  warning: "bg-warning/20 text-warning",
  critical: "bg-destructive/20 text-destructive",
};

export const AlertPanel = ({ alerts }: AlertPanelProps) => {
  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Active Alerts</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
          {alerts.length} Active
        </span>
      </div>
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {alerts.map((alert, index) => {
          const Icon = alertTypeIcons[alert.type];
          return (
            <div
              key={alert.id}
              className={cn(
                "p-4 transition-all hover:bg-secondary/50",
                severityStyles[alert.severity]
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  severityIconBg[alert.severity]
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-medium text-sm text-foreground truncate">
                      {alert.title}
                    </h4>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {alert.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
