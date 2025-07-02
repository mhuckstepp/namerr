import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, style } = body;

    // TODO: Replace with actual backend URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:3001";

    const response = await fetch(`${backendUrl}/api/suggest-similar-names`, {
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
    console.error("Error suggesting similar names:", error);

    // Fallback mock response for development
    const mockResponse = {
      similarNames: [
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
      ],
    };

    return NextResponse.json(mockResponse);
  }
}
