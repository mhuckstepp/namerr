import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCacheStats, cleanupOldCache } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Basic admin check - you might want to add role-based access control
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // For now, allow any authenticated user to view cache stats
    // In production, you'd want to check for admin role
    const stats = await getCacheStats();

    if (!stats) {
      return NextResponse.json(
        { error: "Failed to get cache stats" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error in admin cache stats API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const olderThanDays = parseInt(searchParams.get("olderThanDays") || "30");

    const deletedCount = await cleanupOldCache(olderThanDays);

    return NextResponse.json({
      success: true,
      deletedCount,
      olderThanDays,
    });
  } catch (error) {
    console.error("Error in admin cache cleanup API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
