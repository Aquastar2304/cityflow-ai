import { randomUUID } from "crypto";
import {
  AIRecommendation,
  Alert,
  CongestionData,
  CongestionLevel,
  Junction,
  Metrics,
  Prediction,
  TrafficState,
} from "./types";
import { loadState, saveState } from "./persistence";
import { predictCongestion } from "./analytics";
import { generateRecommendations } from "./optimizer";
import { planEmergencyCorridor } from "./emergency";

const baseJunctions: Junction[] = [
  { id: "j1", name: "MG Road - Brigade Road", lat: 12.9748, lng: 77.6067, congestionLevel: "heavy", vehicleCount: 342, queueLength: 180, avgWaitTime: 124, corridorId: "c1" },
  { id: "j2", name: "Silk Board Junction", lat: 12.9177, lng: 77.6238, congestionLevel: "severe", vehicleCount: 567, queueLength: 420, avgWaitTime: 245, corridorId: "c2" },
  { id: "j3", name: "Hebbal Flyover", lat: 13.0358, lng: 77.5970, congestionLevel: "moderate", vehicleCount: 234, queueLength: 95, avgWaitTime: 67, corridorId: "c3" },
  { id: "j4", name: "KR Puram Junction", lat: 13.0082, lng: 77.6969, congestionLevel: "heavy", vehicleCount: 423, queueLength: 210, avgWaitTime: 156, corridorId: "c2" },
  { id: "j5", name: "Marathahalli Bridge", lat: 12.9591, lng: 77.7011, congestionLevel: "severe", vehicleCount: 498, queueLength: 380, avgWaitTime: 198, corridorId: "c2" },
  { id: "j6", name: "Indiranagar 100ft Road", lat: 12.9784, lng: 77.6408, congestionLevel: "moderate", vehicleCount: 189, queueLength: 78, avgWaitTime: 54, corridorId: "c1" },
  { id: "j7", name: "Koramangala Sony Signal", lat: 12.9352, lng: 77.6245, congestionLevel: "low", vehicleCount: 145, queueLength: 42, avgWaitTime: 28, corridorId: "c4" },
  { id: "j8", name: "Electronic City Toll", lat: 12.8458, lng: 77.6603, congestionLevel: "heavy", vehicleCount: 387, queueLength: 195, avgWaitTime: 134, corridorId: "c5" },
  { id: "j9", name: "Whitefield Main Road", lat: 12.9698, lng: 77.75, congestionLevel: "moderate", vehicleCount: 267, queueLength: 110, avgWaitTime: 76, corridorId: "c6" },
  { id: "j10", name: "Yeshwanthpur Circle", lat: 13.0287, lng: 77.5416, congestionLevel: "low", vehicleCount: 123, queueLength: 35, avgWaitTime: 22, corridorId: "c3" },
  { id: "j11", name: "Jayanagar 4th Block", lat: 12.9308, lng: 77.5838, congestionLevel: "moderate", vehicleCount: 198, queueLength: 88, avgWaitTime: 58, corridorId: "c4" },
  { id: "j12", name: "Majestic Bus Stand", lat: 12.9766, lng: 77.5713, congestionLevel: "severe", vehicleCount: 612, queueLength: 450, avgWaitTime: 267, corridorId: "c7" },
];

const hourlyData: CongestionData[] = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  value: Math.max(
    5,
    Math.min(
      95,
      Math.round(
        10 +
          90 *
            Math.abs(
              Math.sin(((hour + 6) / 24) * Math.PI * 2) * (hour > 12 ? 0.9 : 1.1)
            )
      )
    )
  ),
}));

const baseRecommendations: AIRecommendation[] = [
  {
    id: "r1",
    junctionId: "j2",
    junctionName: "Silk Board Junction",
    action: "Extend northbound green phase by 20 seconds",
    reasoning:
      "Prediction models indicate 45% increase in northbound traffic due to IT park shift end. This adjustment will reduce queue buildup and prevent spillback to Marathahalli.",
    expectedImpact: { travelTimeReduction: 18, fuelSavings: 12, emissionReduction: 15 },
    status: "pending",
  },
  {
    id: "r2",
    junctionId: "j5",
    junctionName: "Marathahalli Bridge",
    action: "Activate bypass corridor via 100ft Road",
    reasoning:
      "Current incident has reduced capacity by 40%. Redirecting traffic through alternate corridor will maintain flow while incident is cleared.",
    expectedImpact: { travelTimeReduction: 25, fuelSavings: 18, emissionReduction: 22 },
    status: "pending",
  },
  {
    id: "r3",
    junctionId: "j12",
    junctionName: "Majestic Bus Stand",
    action: "Coordinate signals across 3 adjacent junctions",
    reasoning:
      "Creating green wave pattern will clear accumulated traffic within 15 minutes. Requires synchronized timing with Gandhi Nagar and Minerva Circle.",
    expectedImpact: { travelTimeReduction: 32, fuelSavings: 24, emissionReduction: 28 },
    status: "pending",
  },
];

const baseAlerts: Alert[] = [
  {
    id: "a1",
    type: "emergency",
    title: "Emergency Vehicle - Ambulance",
    description: "Green corridor active: Victoria Hospital → Silk Board",
    severity: "critical",
    junctionId: "j2",
    timestamp: new Date().toISOString(),
  },
  {
    id: "a2",
    type: "prediction",
    title: "Congestion Predicted",
    description: "Heavy traffic expected at Hebbal Flyover in 20 mins due to office hours",
    severity: "warning",
    junctionId: "j3",
    timestamp: new Date().toISOString(),
  },
  {
    id: "a3",
    type: "incident",
    title: "Road Incident Reported",
    description: "Minor accident near Marathahalli Bridge - 2 lanes blocked",
    severity: "warning",
    junctionId: "j5",
    timestamp: new Date().toISOString(),
  },
];

const baseMetrics: Metrics = {
  avgTravelTime: 42,
  fuelConsumption: 15.2,
  co2Emissions: 38.5,
  emergencyResponseTime: 8.3,
  activeVehicles: 45672,
  optimizedJunctions: 47,
};

const initialState: TrafficState = {
  junctions: baseJunctions.map((j) => ({ ...j })),
  alerts: baseAlerts.map((a) => ({ ...a })),
  recommendations: baseRecommendations.map((r) => ({ ...r })),
  metrics: { ...baseMetrics },
  hourlyData,
  predictions: [],
  emergencies: [],
};

const state: TrafficState = loadState(initialState);

const congestionFromQueue = (queue: number): CongestionLevel => {
  if (queue > 380) return "severe";
  if (queue > 200) return "heavy";
  if (queue > 90) return "moderate";
  return "low";
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const jitter = (value: number, delta: number, min: number, max: number) =>
  clamp(value + (Math.random() * 2 - 1) * delta, min, max);

const updateJunctions = () => {
  state.junctions = state.junctions.map((j) => {
    const vehicleCount = Math.round(jitter(j.vehicleCount, 40, 60, 900));
    const queueLength = Math.round(jitter(j.queueLength, 30, 10, 500));
    const avgWaitTime = Math.round(jitter(j.avgWaitTime, 20, 15, 320));
    const congestionLevel = congestionFromQueue(queueLength);
    return { ...j, vehicleCount, queueLength, avgWaitTime, congestionLevel };
  });
};

const updateMetrics = () => {
  const avgTravelTime = clamp(
    state.junctions.reduce((sum, j) => sum + j.avgWaitTime, 0) / state.junctions.length / 60,
    15,
    90
  );
  const fuelConsumption = jitter(state.metrics.fuelConsumption, 1.5, 10, 22);
  const co2Emissions = jitter(state.metrics.co2Emissions, 3, 20, 55);
  const emergencyResponseTime = jitter(state.metrics.emergencyResponseTime, 0.6, 5, 15);
  const activeVehicles = Math.round(
    clamp(
      state.junctions.reduce((sum, j) => sum + j.vehicleCount, 0) * 2.8,
      12000,
      90000
    )
  );
  const optimizedJunctions = clamp(
    Math.round(jitter(state.metrics.optimizedJunctions, 2, 20, baseJunctions.length)),
    10,
    baseJunctions.length
  );

  state.metrics = {
    avgTravelTime: Math.round(avgTravelTime),
    fuelConsumption: parseFloat(fuelConsumption.toFixed(1)),
    co2Emissions: parseFloat(co2Emissions.toFixed(1)),
    emergencyResponseTime: parseFloat(emergencyResponseTime.toFixed(1)),
    activeVehicles,
    optimizedJunctions,
  };
};

const refreshPredictionsAndRecommendations = () => {
  const predictions: Prediction[] = predictCongestion(state.junctions, 30);
  state.predictions = predictions;
  state.recommendations = generateRecommendations(
    state.junctions,
    predictions,
    state.recommendations
  );
};

const maybeAddAlert = () => {
  const roll = Math.random();
  if (roll > 0.6) return;

  const pick = state.junctions[Math.floor(Math.random() * state.junctions.length)];
  const alertTypes: Alert["type"][] = ["prediction", "incident", "congestion"];
  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const id = randomUUID();
  const title =
    type === "prediction"
      ? "Upcoming congestion detected"
      : type === "incident"
      ? "Minor incident reported"
      : "Severe congestion alert";
  const description =
    type === "prediction"
      ? `Model expects ${pick.name} to cross heavy threshold in 20 mins`
      : type === "incident"
      ? `Temporary capacity drop at ${pick.name}. Field team notified.`
      : `${pick.name} approaching gridlock, coordinating corridor clearance.`;
  const severity: Alert["severity"] = type === "congestion" ? "critical" : "warning";

  state.alerts = [
    {
      id,
      type,
      title,
      description,
      severity,
      junctionId: pick.id,
      timestamp: new Date().toISOString(),
    },
    ...state.alerts.slice(0, 9),
  ];
};

const maybeUpdateRecommendationStatuses = () => {
  state.recommendations = state.recommendations.map((rec) => {
    if (rec.status !== "pending") return rec;
    // Simulate occasional auto-accept when congestion is severe
    const junction = state.junctions.find((j) => j.id === rec.junctionId);
    if (junction?.congestionLevel === "severe" && Math.random() > 0.95) {
      return { ...rec, status: "accepted" };
    }
    return rec;
  });
};

export const updateRecommendationStatus = (
  id: string,
  status: AIRecommendation["status"]
): AIRecommendation | null => {
  const index = state.recommendations.findIndex((rec) => rec.id === id);
  if (index === -1) return null;
  const updated = { ...state.recommendations[index], status };
  state.recommendations[index] = updated;
  saveState(state);
  return updated;
};

export const triggerEmergency = (
  type: "ambulance" | "fire" | "police",
  origin: string,
  destination: string
) => {
  const plan = planEmergencyCorridor(type, origin, destination, state.junctions);
  if (!plan) return null;

  // Add to emergencies list
  state.emergencies = [plan, ...(state.emergencies || [])].slice(0, 5);

  // Add alert
  state.alerts = [
    {
      id: randomUUID(),
      type: "emergency",
      title: "Emergency Green Corridor Activated",
      description: `${type} route from ${origin} to ${destination}`,
      severity: "critical",
      junctionId: origin,
      timestamp: new Date().toISOString(),
    },
    ...state.alerts,
  ].slice(0, 10);

  // Boost optimized junctions metric and persist
  state.metrics.optimizedJunctions = Math.min(state.metrics.optimizedJunctions + 2, baseJunctions.length);
  saveState(state);
  return plan;
};

export const startSimulation = () => {
  updateJunctions();
  updateMetrics();
  refreshPredictionsAndRecommendations();

  setInterval(() => {
    updateJunctions();
    updateMetrics();
    refreshPredictionsAndRecommendations();
    maybeAddAlert();
    maybeUpdateRecommendationStatuses();
    saveState(state);
  }, 5000);
};

export const getState = (): TrafficState => state;

