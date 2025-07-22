import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateNameRanks } from "@/lib/database";
import { Gender } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { nameIds, gender }: { nameIds: string[]; gender: Gender } =
      await request.json();

    if (!nameIds || !Array.isArray(nameIds) || !gender) {
      return NextResponse.json(
        { error: "Name IDs array and gender are required" },
        { status: 400 }
      );
    }

    const success = await updateNameRanks(
      session.user.familyId!,
      gender,
      nameIds
    );

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to update name order" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in reorder-names API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
