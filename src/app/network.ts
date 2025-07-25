export const getNameInfo = async (
  firstName: string,
  lastName: string,
  gender: string,
  refresh: boolean
) => {
  const response = await fetch("/api/analyze-name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, gender, refresh }),
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
