import { NextRequest, NextResponse } from "next/server";
import { getNameRating } from "@/lib/network";
import { getCachedName, saveToCache } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      gender,
      refresh = false,
    } = await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Check cache first (unless refresh is requested)
    if (!refresh) {
      const cachedResult = await getCachedName(firstName, lastName, gender);
      if (cachedResult) {
        return NextResponse.json({
          ...cachedResult,
          cached: true,
          source: "cache",
        });
      }
    }

    // Get new rating from AI
    const { feedback, origin, popularity, middleNames, similarNames } =
      await getNameRating(firstName, lastName, gender);

    const result = {
      firstName,
      lastName,
      origin,
      feedback,
      popularity,
      middleNames,
      similarNames,
      cached: false,
      source: "llm",
    };

    // Save to cache for future requests
    await saveToCache({
      firstName,
      lastName,
      gender,
      origin,
      feedback,
      popularity,
      middleNames,
      similarNames,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in cache-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get("firstName");
    const lastName = searchParams.get("lastName");
    const gender = searchParams.get("gender");

    if (!firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    // Check cache only
    const cachedResult = await getCachedName(firstName, lastName, gender);
    if (cachedResult) {
      return NextResponse.json({
        ...cachedResult,
        cached: true,
        source: "cache",
      });
    }

    return NextResponse.json(
      { error: "Name not found in cache" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in cache-name GET API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
