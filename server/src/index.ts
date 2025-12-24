import express from "express";
import cors from "cors";
import { getState, startSimulation, updateRecommendationStatus, triggerEmergency } from "./simulator";
import { AIRecommendation } from "./types";
import { verifyToken, issueDemoToken } from "./auth";
import { config } from "./config";
import swaggerUi from "swagger-ui-express";
import { explainRecommendation } from "./explainability";
import { recordRecommendationAudit } from "./audit";


const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Demo token issue (non-production)
app.get("/api/demo-token/:role", (req, res) => {
  const { role } = req.params;
  if (!["ops", "planner", "admin"].includes(role)) {
    return res.status(400).json({ error: "role must be ops | planner | admin" });
  }
  const token = issueDemoToken(role as "ops" | "planner" | "admin");
  res.json({ token });
});

// Read endpoints
app.get("/api/junctions", (_req, res) => {
  res.json(getState().junctions);
});

app.get("/api/alerts", (_req, res) => {
  res.json(getState().alerts);
});

app.get("/api/recommendations", (req, res) => {
  const role = req.user?.role;
  const state = getState();

  const enriched = state.recommendations.map((rec) => {
    const prediction = state.predictions?.find((p) => p.junctionId === rec.junctionId);
    return {
      ...rec,
      explanation: explainRecommendation(rec, prediction, role),
    };
  });

  res.json(enriched);
});


app.get("/api/metrics", (_req, res) => {
  res.json(getState().metrics);
});

app.get("/api/hourly", (_req, res) => {
  res.json(getState().hourlyData);
});

app.get("/api/predictions", (req, res) => {
  const horizon = parseInt((req.query.horizon as string) || "30", 10);
  res.json(getState().predictions || []);
});

app.post("/api/emergencies", verifyToken(["ops", "admin"]), (req, res) => {
  const { type, origin, destination } = req.body as {
    type?: "ambulance" | "fire" | "police";
    origin?: string;
    destination?: string;
  };
  if (!type || !origin || !destination) {
    return res.status(400).json({ error: "type, origin, destination are required" });
  }
  const plan = triggerEmergency(type, origin, destination);
  if (!plan) {
    return res.status(404).json({ error: "Could not plan corridor for provided junctions" });
  }
  res.status(201).json(plan);
});

// Mutations
app.patch("/api/recommendations/:id", verifyToken(["ops", "admin"]), (req, res) => {
  const { id } = req.params;
  const { status } = (req.body || {}) as { status?: "accepted" | "rejected" };
  const role = req.user!.role;

  if (!status || !["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      error: "status must be 'accepted' or 'rejected'",
    });
  }

  const updated = updateRecommendationStatus(id, status);
  if (!updated) {
    return res.status(404).json({ error: "Recommendation not found" });
  }

  const explanation =
    explainRecommendation(updated, undefined, role)[0]?.text ?? "";

  recordRecommendationAudit(id, status, role, explanation);

  res.json({
    ...updated,
    explanation: explainRecommendation(updated, undefined, role),
  });
});

startSimulation();

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${config.port}`);
});

// Basic Swagger spec (minimal)
const swaggerDoc = {
  openapi: "3.0.0",
  info: { title: "TraffiQ AI API", version: "1.0.0" },
  servers: [{ url: `http://localhost:${config.port}/api` }],
  paths: {
    "/health": { get: { responses: { 200: { description: "ok" } } } },
    "/junctions": { get: { responses: { 200: { description: "junction list" } } } },
    "/alerts": { get: { responses: { 200: { description: "alerts" } } } },
    "/recommendations": { get: { responses: { 200: { description: "recommendations" } } } },
    "/recommendations/{id}": {
      patch: {
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
            description: "Recommendation ID",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    enum: ["accepted", "rejected"],
                  },
                },
                required: ["status"],
              },
            },
          },
        },
        responses: { 200: { description: "updated recommendation" },
        400: { description: "invalid status" },
        404: { description: "recommendation not found" },
      },
      },
    },
    "/metrics": { get: { responses: { 200: { description: "metrics" } } } },
    "/hourly": { get: { responses: { 200: { description: "hourly congestion" } } } },
    "/predictions": { get: { responses: { 200: { description: "predicted congestion" } } } },
    "/emergencies": {
      post: {
        security: [{ bearerAuth: [] }],
        responses: { 201: { description: "planned emergency corridor" } },
      },
    },
    "/demo-token/{role}": { get: { responses: { 200: { description: "demo token" } } } },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
      },
    },
  },
};

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

