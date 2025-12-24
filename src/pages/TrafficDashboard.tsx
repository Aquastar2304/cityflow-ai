import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Fuel,
  Leaf,
  Siren,
  Car,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { JunctionMap } from "@/components/dashboard/JunctionMap";
import { CongestionChart } from "@/components/dashboard/CongestionChart";
import { Junction, AIRecommendation } from "@/lib/trafficData";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const TrafficDashboard = () => {
  const queryClient = useQueryClient();

  /* 🔐 ROLE (later derive from token) */
  const role: "ops" | "planner" | "admin" = "ops";

  const [selectedJunctionId, setSelectedJunctionId] = useState<string | null>(
    null
  );

  /* =================== QUERIES =================== */

  const { data: junctions = [], isLoading: loadingJunctions } = useQuery({
    queryKey: ["junctions"],
    queryFn: api.getJunctions,
    refetchInterval: 5000,
  });

  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: api.getAlerts,
    refetchInterval: 5000,
  });

  const {
    data: recommendations = [],
    isLoading: loadingRecommendations,
  } = useQuery({
    queryKey: ["recommendations"],
    queryFn: api.getRecommendations,
    refetchInterval: 5000,
  });

  const { data: currentMetrics } = useQuery({
    queryKey: ["metrics"],
    queryFn: api.getMetrics,
    refetchInterval: 5000,
  });

  const { data: hourlyData = [] } = useQuery({
    queryKey: ["hourlyData"],
    queryFn: api.getHourlyData,
    refetchInterval: 10000,
  });

  /* =================== MUTATION =================== */

  const recommendationMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: AIRecommendation["status"];
    }) => api.updateRecommendationStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recommendations"] });
      queryClient.invalidateQueries({ queryKey: ["metrics"] });
    },

    onError: () => {
      toast({
        title: "Action failed",
        description: "Could not update recommendation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAcceptRecommendation = (id: string) => {
    recommendationMutation.mutate(
      { id, status: "accepted" },
      {
        onSuccess: () =>
          toast({
            title: "Recommendation Accepted",
            description: "Signal timing optimization has been applied.",
          }),
      }
    );
  };

  const handleRejectRecommendation = (id: string) => {
    recommendationMutation.mutate(
      { id, status: "rejected" },
      {
        onSuccess: () =>
          toast({
            title: "Recommendation Rejected",
            description: "The AI will learn from this decision.",
          }),
      }
    );
  };

  /* =================== DERIVED =================== */

  const selectedJunction = useMemo(
    () => junctions.find((j) => j.id === selectedJunctionId) ?? null,
    [junctions, selectedJunctionId]
  );

  const pendingRecommendations = recommendations.filter(
    (r) => r.status === "pending"
  );

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["junctions"] });
    queryClient.invalidateQueries({ queryKey: ["alerts"] });
    queryClient.invalidateQueries({ queryKey: ["recommendations"] });
    queryClient.invalidateQueries({ queryKey: ["metrics"] });
    queryClient.invalidateQueries({ queryKey: ["hourlyData"] });
  };

  const isLoading =
    loadingJunctions ||
    loadingAlerts ||
    loadingRecommendations ||
    !currentMetrics;

  /* =================== RENDER =================== */

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Traffic Control Center
              </h1>
              <p className="text-muted-foreground">
                Real-time monitoring and AI-powered optimization
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-success/30">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success font-medium">
                  System Active
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {currentMetrics && (
              <>
                <MetricCard
                  title="Avg Travel Time"
                  value={currentMetrics.avgTravelTime}
                  unit="min"
                  icon={Clock}
                />
                <MetricCard
                  title="Fuel Consumption"
                  value={currentMetrics.fuelConsumption}
                  unit="L/100km"
                  icon={Fuel}
                />
                <MetricCard
                  title="CO₂ Emissions"
                  value={currentMetrics.co2Emissions}
                  unit="t/hr"
                  icon={Leaf}
                />
                <MetricCard
                  title="Emergency Response"
                  value={currentMetrics.emergencyResponseTime}
                  unit="min"
                  icon={Siren}
                />
                <MetricCard
                  title="Active Vehicles"
                  value={currentMetrics.activeVehicles.toLocaleString()}
                  icon={Car}
                />
                <MetricCard
                  title="Optimized Junctions"
                  value={currentMetrics.optimizedJunctions}
                  unit={`/${junctions.length || 52}`}
                  icon={CheckCircle}
                />
              </>
            )}
          </motion.div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <JunctionMap
                junctions={junctions}
                onSelectJunction={(j: Junction) =>
                  setSelectedJunctionId(j.id)
                }
              />
              <CongestionChart data={hourlyData} />
            </div>

            <div className="space-y-6">
              <AlertPanel alerts={alerts} />

              <div className="glass rounded-xl border">
                <div className="p-4 border-b flex justify-between">
                  <h3 className="font-semibold">AI Recommendations</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                    {pendingRecommendations.length} Pending
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  {pendingRecommendations.length ? (
                    pendingRecommendations.map((rec) => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onAccept={handleAcceptRecommendation}
                        onReject={handleRejectRecommendation}
                        role={role}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
                      All recommendations processed
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Junction Detail */}
          {selectedJunction && (
            <motion.div className="mt-6 glass rounded-xl border p-6">
              <h3 className="font-semibold mb-4">
                Junction Detail: {selectedJunction.name}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 p-4 rounded">
                  Vehicle Count: {selectedJunction.vehicleCount}
                </div>
                <div className="bg-secondary/50 p-4 rounded">
                  Queue Length: {selectedJunction.queueLength}m
                </div>
                <div className="bg-secondary/50 p-4 rounded">
                  Avg Wait: {selectedJunction.avgWaitTime}s
                </div>
                <div className="bg-secondary/50 p-4 rounded capitalize">
                  Status: {selectedJunction.congestionLevel}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrafficDashboard;
