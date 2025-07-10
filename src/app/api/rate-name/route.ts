import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNameRating } from "@/lib/network";
import { getSavedNameByLookup } from "@/lib/database";
import { RateNameRequest, RateNameResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName }: RateNameRequest = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Check if we already have this name rated in the database
    const existingRating = await getSavedNameByLookup(
      session.user.id,
      firstName,
      lastName
    );

    if (existingRating) {
      // Return cached result
      const response: RateNameResponse = {
        origin: existingRating.origin,
        feedback: existingRating.feedback,
        popularity: existingRating.popularity,
        middleNames: existingRating.middleNames,
        similarNames: existingRating.similarNames,
      };

      return NextResponse.json({
        ...response,
        cached: true,
        savedNameId: existingRating.id,
      });
    }

    // Get new rating from AI
    const { feedback, origin, popularity, middleNames, similarNames } =
      await getNameRating(firstName, lastName);

    if (!feedback) {
      return NextResponse.json(
        { error: "Failed to rate name" },
        { status: 400 }
      );
    }

    const response: RateNameResponse = {
      origin,
      feedback,
      popularity,
      middleNames,
      similarNames,
    };

    return NextResponse.json({
      ...response,
      cached: false,
    });
  } catch (error) {
    console.error("Error in rate-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
