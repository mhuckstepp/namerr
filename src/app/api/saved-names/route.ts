import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavedNamesWithMetadata } from "@/lib/database";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const savedNames = await getSavedNamesWithMetadata(session.user.id);

    return NextResponse.json({ names: savedNames });
  } catch (error) {
    console.error("Error in saved-names API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
