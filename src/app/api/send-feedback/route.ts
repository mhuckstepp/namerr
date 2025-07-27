import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { savePromptFeedback } from "@/lib/database";

// Save feedback by promptId to the prompt feedback table
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { promptId, feedback } = await request.json();

    if (!promptId || !feedback) {
      return NextResponse.json(
        { error: "Prompt ID and feedback are required" },
        { status: 400 }
      );
    }

    // Validate that at least one feedback field is provided
    const hasFeedback = Object.values(feedback).some(
      (value) => value !== undefined && value !== null && value !== ""
    );

    if (!hasFeedback) {
      return NextResponse.json(
        { error: "At least one feedback field must be provided" },
        { status: 400 }
      );
    }

    await savePromptFeedback(promptId, feedback, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving prompt feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
