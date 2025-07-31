import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getNameRating } from "@/lib/network";
import {
  getSavedNameByLookup,
  getCachedName,
  saveToCache,
  saveName,
} from "@/lib/database";
import {
  RateNameRequest,
  Gender,
  RateNameResponse,
  SavedNameData,
} from "@/lib/types";

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

    const { firstName, lastName, gender, refresh, isSaved }: RateNameRequest =
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
        promptId: existingRating.promptId,
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

    const metadata = await getNameRating(firstName, lastName, gender);

    saveToCache(metadata);

    let savedName: SavedNameData | undefined;
    // If they have already saved the name and are refreshing, update the saved version and return an update name with rank
    if (isSaved && refresh) {
      const response = await saveName(
        session.user.familyId,
        session.user.id,
        firstName,
        lastName,
        gender as Gender,
        metadata
      );
      savedName = response.savedName;
    }
    return NextResponse.json({
      ...metadata,
      ...savedName,
      cached: false,
      source: Source.LLM,
    });
  } catch (error) {
    console.error("Error in rate-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
