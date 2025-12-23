import { motion } from "framer-motion";
import { 
  TrendingUp, 
  MapPin, 
  AlertTriangle, 
  BarChart3,
  Calendar,
  Download,
  Filter
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { junctions, hourlyData } from "@/lib/trafficData";
import { cn } from "@/lib/utils";

// Bottleneck data
const bottlenecks = [
  { id: 1, name: "Silk Board Junction", severity: "critical", avgDelay: 245, improvement: "+35% capacity needed" },
  { id: 2, name: "Marathahalli Bridge", severity: "high", avgDelay: 198, improvement: "Signal optimization pending" },
  { id: 3, name: "Majestic Bus Stand", severity: "critical", avgDelay: 267, improvement: "Pedestrian subway recommended" },
  { id: 4, name: "KR Puram Junction", severity: "medium", avgDelay: 156, improvement: "Flyover proposal under review" },
];

// Weekly trend data
const weeklyTrend = [
  { day: "Mon", congestion: 78, baseline: 85 },
  { day: "Tue", congestion: 72, baseline: 82 },
  { day: "Wed", congestion: 75, baseline: 84 },
  { day: "Thu", congestion: 68, baseline: 80 },
  { day: "Fri", congestion: 82, baseline: 90 },
  { day: "Sat", congestion: 55, baseline: 65 },
  { day: "Sun", congestion: 42, baseline: 52 },
];

// Congestion distribution
const congestionDistribution = [
  { name: "Low", value: 3, color: "hsl(142, 70%, 45%)" },
  { name: "Moderate", value: 4, color: "hsl(45, 95%, 55%)" },
  { name: "Heavy", value: 3, color: "hsl(25, 95%, 53%)" },
  { name: "Severe", value: 2, color: "hsl(0, 72%, 51%)" },
];

// Impact metrics
const impactMetrics = [
  { label: "Total Hours Saved", value: "12,450", change: "+18%", period: "This Month" },
  { label: "Fuel Conserved", value: "45,200 L", change: "+22%", period: "This Month" },
  { label: "CO₂ Prevented", value: "108 tons", change: "+15%", period: "This Month" },
  { label: "Economic Value", value: "₹2.4 Cr", change: "+25%", period: "This Month" },
];

const PlannerDashboard = () => {
  const severeJunctions = junctions.filter(j => j.congestionLevel === "severe");
  
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
                City Planner Dashboard
              </h1>
              <p className="text-muted-foreground">
                Strategic analytics and infrastructure insights
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4" />
                Last 30 Days
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="default" size="sm">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </motion.div>

          {/* Impact Metrics */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {impactMetrics.map((metric, index) => (
              <div 
                key={index}
                className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all duration-300"
              >
                <p className="text-xs text-muted-foreground mb-1">{metric.period}</p>
                <p className="text-2xl font-bold text-foreground mb-1">{metric.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span className="text-xs font-medium text-success">{metric.change}</span>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Weekly Trend Chart */}
            <motion.div 
              className="lg:col-span-2 glass rounded-xl border border-border p-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Weekly Congestion Trend</h3>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded bg-primary" />
                    <span className="text-muted-foreground">AI Optimized</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded bg-muted-foreground/50" />
                    <span className="text-muted-foreground">Baseline</span>
                  </div>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(185, 70%, 50%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 25%, 14%)",
                        border: "1px solid hsl(220, 20%, 22%)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "hsl(210, 40%, 98%)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="baseline"
                      stroke="hsl(215, 15%, 45%)"
                      strokeWidth={1}
                      strokeDasharray="4"
                      fill="none"
                    />
                    <Area
                      type="monotone"
                      dataKey="congestion"
                      stroke="hsl(185, 70%, 50%)"
                      strokeWidth={2}
                      fill="url(#weeklyGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Congestion Distribution */}
            <motion.div 
              className="glass rounded-xl border border-border p-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="font-semibold text-foreground mb-4">Junction Distribution</h3>
              <div className="h-[200px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={congestionDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {congestionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 25%, 14%)",
                        border: "1px solid hsl(220, 20%, 22%)",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {congestionDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bottleneck Analysis */}
            <motion.div 
              className="glass rounded-xl border border-border overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Infrastructure Bottlenecks</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive font-medium">
                  {bottlenecks.filter(b => b.severity === "critical").length} Critical
                </span>
              </div>
              <div className="divide-y divide-border">
                {bottlenecks.map((bottleneck) => (
                  <div key={bottleneck.id} className="p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                          bottleneck.severity === "critical" ? "bg-destructive/20 text-destructive" :
                          bottleneck.severity === "high" ? "bg-warning/20 text-warning" :
                          "bg-info/20 text-info"
                        )}>
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-foreground mb-1">
                            {bottleneck.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {bottleneck.improvement}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{bottleneck.avgDelay}s</p>
                        <p className="text-xs text-muted-foreground">Avg Delay</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Hourly Distribution */}
            <motion.div 
              className="glass rounded-xl border border-border p-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h3 className="font-semibold text-foreground mb-4">Peak Hour Analysis</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={hourlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey="hour"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
                      tickFormatter={(value) => `${value}h`}
                      interval={2}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 10 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(220, 25%, 14%)",
                        border: "1px solid hsl(220, 20%, 22%)",
                        borderRadius: "8px",
                      }}
                      labelFormatter={(value) => `${value}:00`}
                      formatter={(value: number) => [`${value}%`, "Congestion"]}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {hourlyData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={
                            entry.value > 80 ? "hsl(0, 72%, 51%)" :
                            entry.value > 60 ? "hsl(25, 95%, 53%)" :
                            entry.value > 40 ? "hsl(45, 95%, 55%)" :
                            "hsl(142, 70%, 45%)"
                          }
                        />
                      ))}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                <span>Morning Peak: 9:00 (92%)</span>
                <span>Evening Peak: 18:00 (95%)</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlannerDashboard;
