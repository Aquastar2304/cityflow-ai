// Simulated traffic data for TraffiQ AI

export type CongestionLevel = "low" | "moderate" | "heavy" | "severe";

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
  timestamp: Date;
}

export interface AIRecommendation {
  id: string;
  junctionId: string;
  junctionName: string;
  action: string;
  reasoning: string;
  expectedImpact: {
    travelTimeReduction: number;
    fuelSavings: number;
    emissionReduction: number;
  };
  status: "pending" | "accepted" | "rejected";
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

// Bangalore junctions data
export const junctions: Junction[] = [
  { id: "j1", name: "MG Road - Brigade Road", lat: 12.9748, lng: 77.6067, congestionLevel: "heavy", vehicleCount: 342, queueLength: 180, avgWaitTime: 124, corridorId: "c1" },
  { id: "j2", name: "Silk Board Junction", lat: 12.9177, lng: 77.6238, congestionLevel: "severe", vehicleCount: 567, queueLength: 420, avgWaitTime: 245, corridorId: "c2" },
  { id: "j3", name: "Hebbal Flyover", lat: 13.0358, lng: 77.5970, congestionLevel: "moderate", vehicleCount: 234, queueLength: 95, avgWaitTime: 67, corridorId: "c3" },
  { id: "j4", name: "KR Puram Junction", lat: 13.0082, lng: 77.6969, congestionLevel: "heavy", vehicleCount: 423, queueLength: 210, avgWaitTime: 156, corridorId: "c2" },
  { id: "j5", name: "Marathahalli Bridge", lat: 12.9591, lng: 77.7011, congestionLevel: "severe", vehicleCount: 498, queueLength: 380, avgWaitTime: 198, corridorId: "c2" },
  { id: "j6", name: "Indiranagar 100ft Road", lat: 12.9784, lng: 77.6408, congestionLevel: "moderate", vehicleCount: 189, queueLength: 78, avgWaitTime: 54, corridorId: "c1" },
  { id: "j7", name: "Koramangala Sony Signal", lat: 12.9352, lng: 77.6245, congestionLevel: "low", vehicleCount: 145, queueLength: 42, avgWaitTime: 28, corridorId: "c4" },
  { id: "j8", name: "Electronic City Toll", lat: 12.8458, lng: 77.6603, congestionLevel: "heavy", vehicleCount: 387, queueLength: 195, avgWaitTime: 134, corridorId: "c5" },
  { id: "j9", name: "Whitefield Main Road", lat: 12.9698, lng: 77.7500, congestionLevel: "moderate", vehicleCount: 267, queueLength: 110, avgWaitTime: 76, corridorId: "c6" },
  { id: "j10", name: "Yeshwanthpur Circle", lat: 13.0287, lng: 77.5416, congestionLevel: "low", vehicleCount: 123, queueLength: 35, avgWaitTime: 22, corridorId: "c3" },
  { id: "j11", name: "Jayanagar 4th Block", lat: 12.9308, lng: 77.5838, congestionLevel: "moderate", vehicleCount: 198, queueLength: 88, avgWaitTime: 58, corridorId: "c4" },
  { id: "j12", name: "Majestic Bus Stand", lat: 12.9766, lng: 77.5713, congestionLevel: "severe", vehicleCount: 612, queueLength: 450, avgWaitTime: 267, corridorId: "c7" },
];

export const alerts: Alert[] = [
  {
    id: "a1",
    type: "emergency",
    title: "Emergency Vehicle - Ambulance",
    description: "Green corridor active: Victoria Hospital → Silk Board",
    severity: "critical",
    junctionId: "j2",
    timestamp: new Date(Date.now() - 2 * 60000),
  },
  {
    id: "a2",
    type: "prediction",
    title: "Congestion Predicted",
    description: "Heavy traffic expected at Hebbal Flyover in 20 mins due to office hours",
    severity: "warning",
    junctionId: "j3",
    timestamp: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "a3",
    type: "incident",
    title: "Road Incident Reported",
    description: "Minor accident near Marathahalli Bridge - 2 lanes blocked",
    severity: "warning",
    junctionId: "j5",
    timestamp: new Date(Date.now() - 8 * 60000),
  },
  {
    id: "a4",
    type: "congestion",
    title: "Severe Congestion Alert",
    description: "Majestic area experiencing gridlock conditions",
    severity: "critical",
    junctionId: "j12",
    timestamp: new Date(Date.now() - 12 * 60000),
  },
];

export const recommendations: AIRecommendation[] = [
  {
    id: "r1",
    junctionId: "j2",
    junctionName: "Silk Board Junction",
    action: "Extend northbound green phase by 20 seconds",
    reasoning: "Prediction models indicate 45% increase in northbound traffic due to IT park shift end. This adjustment will reduce queue buildup and prevent spillback to Marathahalli.",
    expectedImpact: { travelTimeReduction: 18, fuelSavings: 12, emissionReduction: 15 },
    status: "pending",
  },
  {
    id: "r2",
    junctionId: "j5",
    junctionName: "Marathahalli Bridge",
    action: "Activate bypass corridor via 100ft Road",
    reasoning: "Current incident has reduced capacity by 40%. Redirecting traffic through alternate corridor will maintain flow while incident is cleared.",
    expectedImpact: { travelTimeReduction: 25, fuelSavings: 18, emissionReduction: 22 },
    status: "pending",
  },
  {
    id: "r3",
    junctionId: "j12",
    junctionName: "Majestic Bus Stand",
    action: "Coordinate signals across 3 adjacent junctions",
    reasoning: "Creating green wave pattern will clear accumulated traffic within 15 minutes. Requires synchronized timing with Gandhi Nagar and Minerva Circle.",
    expectedImpact: { travelTimeReduction: 32, fuelSavings: 24, emissionReduction: 28 },
    status: "pending",
  },
];

export const currentMetrics: Metrics = {
  avgTravelTime: 42,
  fuelConsumption: 15.2,
  co2Emissions: 38.5,
  emergencyResponseTime: 8.3,
  activeVehicles: 45672,
  optimizedJunctions: 47,
};

export const hourlyData: CongestionData[] = [
  { hour: 0, value: 12 },
  { hour: 1, value: 8 },
  { hour: 2, value: 5 },
  { hour: 3, value: 4 },
  { hour: 4, value: 6 },
  { hour: 5, value: 15 },
  { hour: 6, value: 35 },
  { hour: 7, value: 58 },
  { hour: 8, value: 85 },
  { hour: 9, value: 92 },
  { hour: 10, value: 78 },
  { hour: 11, value: 65 },
  { hour: 12, value: 55 },
  { hour: 13, value: 52 },
  { hour: 14, value: 48 },
  { hour: 15, value: 55 },
  { hour: 16, value: 68 },
  { hour: 17, value: 88 },
  { hour: 18, value: 95 },
  { hour: 19, value: 82 },
  { hour: 20, value: 58 },
  { hour: 21, value: 42 },
  { hour: 22, value: 28 },
  { hour: 23, value: 18 },
];

export const getCongestionColor = (level: CongestionLevel): string => {
  switch (level) {
    case "low": return "bg-traffic-low";
    case "moderate": return "bg-traffic-moderate";
    case "heavy": return "bg-traffic-heavy";
    case "severe": return "bg-traffic-severe";
  }
};

export const getCongestionTextColor = (level: CongestionLevel): string => {
  switch (level) {
    case "low": return "text-traffic-low";
    case "moderate": return "text-traffic-moderate";
    case "heavy": return "text-traffic-heavy";
    case "severe": return "text-traffic-severe";
  }
};
