export type CongestionLevel = "low" | "moderate" | "heavy" | "severe";
export type ExplanationLevel = "short" | "detailed" | "technical";

export interface Explanation {
  level: ExplanationLevel;
  text: string;
}

export interface AuditLog {
  id: string;
  entity: "recommendation";
  entityId: string;
  action: "accepted" | "rejected";
  role: "ops" | "planner" | "admin";
  explanation: string;
  timestamp: string;
}

export interface Junction {
  id: string;
  name: string;
  lat: number;
  lng: number;
  congestionLevel: CongestionLevel;
  vehicleCount: number;
  queueLength: number;
  avgWaitTime: number;
  corridorId: string;
}

export interface Alert {
  id: string;
  type: "emergency" | "congestion" | "incident" | "prediction";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  junctionId?: string;
  timestamp: string;
}

export interface ExpectedImpact {
  travelTimeReduction: number;
  fuelSavings: number;
  emissionReduction: number;
}

export interface AIRecommendation {
  id: string;
  junctionId: string;
  junctionName: string;
  action: string;
  reasoning: string;
  expectedImpact: ExpectedImpact;
  status: "pending" | "accepted" | "rejected";
  explanation?: Explanation[];
}

export interface Metrics {
  avgTravelTime: number;
  fuelConsumption: number;
  co2Emissions: number;
  emergencyResponseTime: number;
  activeVehicles: number;
  optimizedJunctions: number;
}

export interface CongestionData {
  hour: number;
  value: number;
}

export interface Prediction {
  junctionId: string;
  junctionName: string;
  horizonMinutes: number;
  predictedCongestion: CongestionLevel;
  projectedVehicleCount: number;
  projectedQueueLength: number;
  confidence: number; // 0-1
  reason: string;
}

export interface EmergencyEvent {
  id: string;
  type: "ambulance" | "fire" | "police";
  origin: string; // junction id
  destination: string; // junction id
  status: "active" | "completed" | "cancelled";
  route: string[]; // junction ids in order
  startedAt: string;
  completedAt?: string;
}

export interface CorridorAction {
  junctionId: string;
  action: string;
  durationSec: number;
}

export interface EmergencyPlan {
  event: EmergencyEvent;
  corridor: CorridorAction[];
}

export interface TrafficState {
  junctions: Junction[];
  alerts: Alert[];
  recommendations: AIRecommendation[];
  metrics: Metrics;
  hourlyData: CongestionData[];
  predictions?: Prediction[];
  emergencies?: EmergencyPlan[];
}

