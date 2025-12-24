import { AIRecommendation, Alert, CongestionData, Junction, Metrics } from "./trafficData";
import { getAuthToken } from "./auth";

const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

const authHeaders = () => {
  const token = getAuthToken() || import.meta.env.VITE_API_TOKEN;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const fetchJson = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export const api = {
  getJunctions: () => fetchJson<Junction[]>("/junctions"),
  getAlerts: () => fetchJson<Alert[]>("/alerts"),
  getRecommendations: () => fetchJson<AIRecommendation[]>("/recommendations"),
  getMetrics: () => fetchJson<Metrics>("/metrics"),
  getHourlyData: () => fetchJson<CongestionData[]>("/hourly"),

  updateRecommendationStatus: async (
    id: string,
    status: AIRecommendation["status"]
  ) => {
    const res = await fetch(`${API_BASE}/recommendations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg || "Failed to update recommendation");
    }
    return res.json() as Promise<AIRecommendation>;
  },
};
