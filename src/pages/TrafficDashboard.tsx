import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  Fuel, 
  Leaf, 
  Siren, 
  Car, 
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { JunctionMap } from "@/components/dashboard/JunctionMap";
import { CongestionChart } from "@/components/dashboard/CongestionChart";
import { 
  junctions, 
  alerts, 
  recommendations as initialRecommendations, 
  currentMetrics,
  hourlyData,
  Junction,
  AIRecommendation
} from "@/lib/trafficData";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const TrafficDashboard = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);
  const [selectedJunction, setSelectedJunction] = useState<Junction | null>(null);

  const handleAcceptRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, status: "accepted" as const } : r)
    );
    toast({
      title: "Recommendation Accepted",
      description: "Signal timing optimization has been applied.",
    });
  };

  const handleRejectRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, status: "rejected" as const } : r)
    );
    toast({
      title: "Recommendation Rejected",
      description: "The AI will learn from this decision.",
    });
  };

  const pendingRecommendations = recommendations.filter(r => r.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                Traffic Control Center
              </h1>
              <p className="text-muted-foreground">
                Real-time monitoring and AI-powered optimization
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-success/30">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs text-success font-medium">System Active</span>
              </div>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </motion.div>

          {/* Metrics Row */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <MetricCard
              title="Avg Travel Time"
              value={currentMetrics.avgTravelTime}
              unit="min"
              icon={Clock}
              trend={{ value: 12, positive: true }}
              variant="primary"
            />
            <MetricCard
              title="Fuel Consumption"
              value={currentMetrics.fuelConsumption}
              unit="L/100km"
              icon={Fuel}
              trend={{ value: 8, positive: true }}
              variant="warning"
            />
            <MetricCard
              title="CO₂ Emissions"
              value={currentMetrics.co2Emissions}
              unit="t/hr"
              icon={Leaf}
              trend={{ value: 15, positive: true }}
              variant="success"
            />
            <MetricCard
              title="Emergency Response"
              value={currentMetrics.emergencyResponseTime}
              unit="min"
              icon={Siren}
              variant="destructive"
            />
            <MetricCard
              title="Active Vehicles"
              value={currentMetrics.activeVehicles.toLocaleString()}
              icon={Car}
            />
            <MetricCard
              title="Optimized Junctions"
              value={currentMetrics.optimizedJunctions}
              unit="/52"
              icon={CheckCircle}
              variant="success"
            />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Map & Chart */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <JunctionMap 
                junctions={junctions} 
                onSelectJunction={setSelectedJunction}
              />
              <CongestionChart data={hourlyData} />
            </motion.div>

            {/* Right Column - Alerts & Recommendations */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <AlertPanel alerts={alerts} />
              
              <div className="glass rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">AI Recommendations</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                    {pendingRecommendations.length} Pending
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  {pendingRecommendations.length > 0 ? (
                    pendingRecommendations.map(rec => (
                      <RecommendationCard
                        key={rec.id}
                        recommendation={rec}
                        onAccept={handleAcceptRecommendation}
                        onReject={handleRejectRecommendation}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
                      <p className="text-sm">All recommendations processed</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Selected Junction Detail */}
          {selectedJunction && (
            <motion.div 
              className="mt-6 glass rounded-xl border border-primary/20 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">
                  Junction Detail: {selectedJunction.name}
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedJunction(null)}
                >
                  Close
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Count</p>
                  <p className="text-xl font-bold text-foreground">{selectedJunction.vehicleCount}</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Queue Length</p>
                  <p className="text-xl font-bold text-foreground">{selectedJunction.queueLength}m</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Avg Wait Time</p>
                  <p className="text-xl font-bold text-foreground">{selectedJunction.avgWaitTime}s</p>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-xl font-bold capitalize text-foreground">{selectedJunction.congestionLevel}</p>
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
