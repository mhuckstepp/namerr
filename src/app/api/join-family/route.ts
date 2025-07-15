import { authOptions } from "@/lib/auth";
import { joinFamily, leaveFamily } from "@/lib/database";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        leaveFamily(session.user.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in leave-family API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { shareToken } = await request.json();

        if (!shareToken) {
            return NextResponse.json({ error: "Share token is required" }, { status: 400 });
        }

        const success = await joinFamily(session.user.id, shareToken);

        if (!success) {
            return NextResponse.json({ error: "Failed to join family" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error in join-family API:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
