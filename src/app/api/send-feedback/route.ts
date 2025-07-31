import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { savePromptFeedback } from "@/lib/database";
import { PromptFeedbackData } from "@/lib/types";

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

    await savePromptFeedback(
      promptId,
      feedback as PromptFeedbackData,
      session.user.id
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving prompt feedback:", error);
    return NextResponse.json(
      { error: "Failed to save feedback" },
      { status: 500 }
    );
  }
}
