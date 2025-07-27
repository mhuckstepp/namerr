import { RateNameRequest } from "@/lib/types";

export const getNameInfo = async (request: RateNameRequest) => {
  const response = await fetch("/api/analyze-name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to get name info");
  }

  return response.json();
};

export const sendFeedback = async (
  promptId: string,
  name: string,
  feedback: string,
  feedbackType: string
) => {
  const response = await fetch("/api/send-feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ promptId, name, feedback, feedbackType }),
  });

  if (!response.ok) {
    throw new Error("Failed to send feedback");
  }

  return response.json();
};
