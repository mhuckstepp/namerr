import express from "express";
import "dotenv/config";
import { getNameRating } from "./network";
import cors from "cors";
import {
  RateNameRequest,
  RateNameResponse,
  SuggestMiddleNamesRequest,
  SuggestMiddleNamesResponse,
  SuggestSimilarNamesRequest,
  SuggestSimilarNamesResponse,
} from "@shared/types";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Basic health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/rate-name", async (req, res) => {
  const { firstName, lastName, style }: RateNameRequest = req?.body || {};
  if (!firstName || !lastName) {
    res.status(400).json({ error: "First name and last name are required" });
    return;
  }

  const fullName = `${firstName} ${lastName}`;
  const { rating, explanation, rawResponse } = await getNameRating(fullName);

  if (!rating || !explanation) {
    res.status(400).json({ error: "Failed to rate name" });
    return;
  }

  // Mock response for now - replace with actual rating logic
  const mockRating: RateNameResponse = {
    score: rating,
    feedback: explanation,
  };

  res.json(mockRating);
});

app.post("/api/suggest-middle-names", async (req, res) => {
  const { firstName, lastName, style }: SuggestMiddleNamesRequest =
    req?.body || {};

  // Mock response - replace with actual suggestion logic
  const middleNames = [
    "Grace",
    "James",
    "Rose",
    "Alexander",
    "Mae",
    "Theodore",
    "Elizabeth",
    "William",
  ];

  const response: SuggestMiddleNamesResponse = { middleNames };
  res.json(response);
});

app.post("/api/suggest-similar-names", async (req, res) => {
  const { firstName, lastName, style }: SuggestSimilarNamesRequest =
    req?.body || {};

  // Mock response - replace with actual suggestion logic
  const similarNames = [
    "Emma",
    "Oliver",
    "Sophia",
    "Liam",
    "Isabella",
    "Noah",
    "Ava",
    "Ethan",
    "Mia",
    "Lucas",
  ];

  const response: SuggestSimilarNamesResponse = { similarNames };
  res.json(response);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
