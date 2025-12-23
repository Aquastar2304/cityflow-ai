import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Brain, 
  Zap, 
  TrendingUp, 
  Siren, 
  Network,
  ArrowRight,
  Activity,
  BarChart3,
  Clock,
  Fuel,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Prediction",
    description: "Forecasts congestion 15-30 minutes ahead using machine learning models trained on historical traffic patterns.",
  },
  {
    icon: Network,
    title: "Multi-Junction Coordination",
    description: "Synchronizes signal timings across traffic corridors for seamless green wave progression.",
  },
  {
    icon: Siren,
    title: "Emergency Green Corridor",
    description: "Automatically creates clear paths for emergency vehicles, reducing response times by up to 40%.",
  },
  {
    icon: Zap,
    title: "Explainable AI",
    description: "Every decision includes clear, human-readable explanations for transparency and trust.",
  },
];

const metrics = [
  { icon: Clock, value: "25%", label: "Reduced Travel Time", color: "text-primary" },
  { icon: Fuel, value: "20%", label: "Fuel Savings", color: "text-warning" },
  { icon: Leaf, value: "28%", label: "Lower Emissions", color: "text-success" },
  { icon: TrendingUp, value: "40%", label: "Faster Response", color: "text-info" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(185_30%_15%_/_0.3),_transparent_50%)]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Intelligent Traffic Management System
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Smarter Traffic.</span>
              <br />
              <span className="text-gradient">Safer Cities.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              TraffiQ AI uses artificial intelligence to predict congestion, 
              optimize signal timings, and create emergency corridors—transforming 
              urban mobility in Bangalore.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/traffic-dashboard">
                <Button variant="hero" size="xl" className="group">
                  <Activity className="w-5 h-5" />
                  Traffic Control Center
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/planner-dashboard">
                <Button variant="glass" size="xl">
                  <BarChart3 className="w-5 h-5" />
                  City Planner Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Metrics Strip */}
          <motion.div 
            className="max-w-4xl mx-auto mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <div 
                  key={index}
                  className="glass rounded-xl p-5 text-center border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <Icon className={`w-6 h-6 ${metric.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                    {metric.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.label}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Intelligent Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powered by cutting-edge AI technology to transform urban traffic management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  className="glass rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:glow-primary transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto glass rounded-3xl p-10 md:p-16 text-center border border-primary/20 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="relative">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ready to Transform Urban Mobility?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Experience the future of traffic management with AI-driven insights, 
                real-time optimization, and complete transparency.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/traffic-dashboard">
                  <Button variant="hero" size="lg">
                    Launch Control Center
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>TraffiQ AI — Intelligent Traffic Management for Bangalore</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
