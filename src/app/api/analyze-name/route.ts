import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNameRating } from "@/lib/network";
import {
  getSavedNameByLookup,
  getCachedName,
  saveToCache,
} from "@/lib/database";
import { RateNameRequest, Gender } from "@/lib/types";

enum Source {
  GLOBAL_CACHE = "global_cache",
  USER_SAVED = "user_saved",
  LLM = "llm",
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, gender, refresh }: RateNameRequest =
      await request.json();

    if (!firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: "First name, last name, and gender are required" },
        { status: 400 }
      );
    }

    // First check global cache (unless refresh is requested)
    if (!refresh) {
      const cachedResult = await getCachedName(firstName, lastName, gender);
      if (cachedResult) {
        return NextResponse.json({
          firstName,
          lastName,
          gender,
          ...cachedResult,
          cached: true,
          source: Source.GLOBAL_CACHE,
        });
      }
    }

    const existingRating = await getSavedNameByLookup(
      session.user.id,
      firstName,
      lastName,
      gender as Gender
    );

    if (existingRating && !refresh) {
      return NextResponse.json({
        firstName,
        lastName,
        gender,
        origin: existingRating.origin,
        feedback: existingRating.feedback,
        popularity: existingRating.popularity,
        middleNames: existingRating.middleNames,
        similarNames: existingRating.similarNames,
        cached: true,
        source: Source.USER_SAVED,
        savedNameId: existingRating.id,
      });
    }

    const { feedback, origin, popularity, middleNames, similarNames } =
      await getNameRating(firstName, lastName, gender);

    const result = {
      firstName,
      lastName,
      gender,
      origin,
      feedback,
      popularity,
      middleNames,
      similarNames,
      cached: false,
      source: Source.LLM,
    };

    saveToCache(firstName, lastName, gender, {
      origin,
      feedback,
      popularity,
      middleNames,
      similarNames,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in rate-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
