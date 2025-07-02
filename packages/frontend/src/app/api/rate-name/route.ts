import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, style } = body;

    // TODO: Replace with actual backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/rate-name`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, style }),
    });

    if (!response.ok) {
      throw new Error("Backend request failed");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error rating name:", error);

    // Fallback mock response for development
    const mockResponse = {
      score: Math.floor(Math.random() * 40) + 60,
      feedback: `${body?.firstName || "This name"} ${
        body?.lastName || ""
      } has a lovely flow and fits well with the ${
        body?.style || "selected"
      } style. The combination is memorable and has a nice rhythm.`,
    };

    return NextResponse.json(mockResponse);
  }
}
