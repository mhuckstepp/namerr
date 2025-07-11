import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { saveNameWithMetadata } from "@/lib/database";
import { RateNameResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      firstName,
      lastName,
      gender,
      metadata,
    }: {
      firstName: string;
      lastName: string;
      gender: string;
      metadata: RateNameResponse;
    } = await request.json();

    if (!firstName || !lastName || !metadata) {
      return NextResponse.json(
        { error: "First name, last name, and metadata are required" },
        { status: 400 }
      );
    }

    const result = await saveNameWithMetadata(
      session.user.id,
      firstName,
      lastName,
      gender,
      metadata
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        savedName: result.savedName,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to save name" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error in save-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
