import { NextRequest, NextResponse } from "next/server";
import { getNameRating } from "@/lib/network";
import { RateNameRequest, RateNameResponse } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, style }: RateNameRequest =
      await request.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First name and last name are required" },
        { status: 400 }
      );
    }

    const fullName = `${firstName} ${lastName}`;
    const { feedback, origin, middleNames, similarNames } = await getNameRating(
      fullName,
      style
    );

    if (!feedback) {
      console.log("Failed to rate name", { fullName, style });
      return NextResponse.json(
        { error: "Failed to rate name" },
        { status: 400 }
      );
    }

    const response: RateNameResponse = {
      origin,
      feedback,
      middleNames,
      similarNames,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in rate-name API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
