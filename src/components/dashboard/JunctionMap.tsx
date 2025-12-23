import { Junction, getCongestionColor } from "@/lib/trafficData";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useState } from "react";

interface JunctionMapProps {
  junctions: Junction[];
  onSelectJunction?: (junction: Junction) => void;
}

export const JunctionMap = ({ junctions, onSelectJunction }: JunctionMapProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Normalize coordinates for display (Bangalore bounds)
  const minLat = 12.82;
  const maxLat = 13.06;
  const minLng = 77.50;
  const maxLng = 77.78;

  const normalizePosition = (lat: number, lng: number) => ({
    x: ((lng - minLng) / (maxLng - minLng)) * 100,
    y: 100 - ((lat - minLat) / (maxLat - minLat)) * 100,
  });

  return (
    <div className="glass rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Junction Status Map</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-traffic-low" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-traffic-moderate" />
            <span className="text-xs text-muted-foreground">Mod</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-traffic-heavy" />
            <span className="text-xs text-muted-foreground">Heavy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-traffic-severe traffic-pulse" />
            <span className="text-xs text-muted-foreground">Severe</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-[16/10] bg-gradient-to-br from-secondary/50 to-background p-4">
        {/* Grid lines for visual reference */}
        <div className="absolute inset-4 grid grid-cols-6 grid-rows-4 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="border border-border/20" />
          ))}
        </div>

        {/* Road network simulation */}
        <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] pointer-events-none">
          {/* Main roads (simplified) */}
          <line x1="10%" y1="50%" x2="90%" y2="50%" className="stroke-border" strokeWidth="2" strokeDasharray="4" />
          <line x1="50%" y1="10%" x2="50%" y2="90%" className="stroke-border" strokeWidth="2" strokeDasharray="4" />
          <line x1="20%" y1="20%" x2="80%" y2="80%" className="stroke-border/50" strokeWidth="1" strokeDasharray="4" />
          <line x1="80%" y1="20%" x2="20%" y2="80%" className="stroke-border/50" strokeWidth="1" strokeDasharray="4" />
        </svg>

        {/* Junction markers */}
        {junctions.map((junction) => {
          const pos = normalizePosition(junction.lat, junction.lng);
          const isHovered = hoveredId === junction.id;
          const isSevere = junction.congestionLevel === "severe";

          return (
            <div
              key={junction.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              onMouseEnter={() => setHoveredId(junction.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectJunction?.(junction)}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded-full border-2 border-background transition-all duration-300",
                  getCongestionColor(junction.congestionLevel),
                  isSevere && "traffic-pulse",
                  isHovered && "scale-150 z-20"
                )}
              />
              
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 glass rounded-lg p-3 shadow-lg border border-border animate-fade-in z-30">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground truncate">
                      {junction.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Vehicles:</span>
                      <span className="ml-1 text-foreground font-medium">{junction.vehicleCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Queue:</span>
                      <span className="ml-1 text-foreground font-medium">{junction.queueLength}m</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Avg Wait:</span>
                      <span className="ml-1 text-foreground font-medium">{junction.avgWaitTime}s</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* City label */}
        <div className="absolute bottom-2 left-4 text-xs text-muted-foreground font-medium">
          Bangalore, India
        </div>
      </div>
    </div>
  );
};
