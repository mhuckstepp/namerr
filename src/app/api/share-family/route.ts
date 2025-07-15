import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getShareURL } from "@/lib/database";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    let familyId = session?.user?.familyId;

    if (!familyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareURL = await getShareURL(familyId);

    return NextResponse.json({ shareURL });
  } catch (error) {
    console.error("Error in share-family API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
