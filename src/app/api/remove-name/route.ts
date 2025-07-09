import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { removeNameWithMetadata } from "@/lib/database";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nameId } = await request.json();

    if (!nameId || typeof nameId !== "string") {
      return NextResponse.json(
        { error: "Name ID is required" },
        { status: 400 }
      );
    }

    const result = await removeNameWithMetadata(session.user.id, nameId);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to remove name" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in remove-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
