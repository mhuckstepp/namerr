"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookmarkCheck, User, Users } from "lucide-react";
import { SavedNameData } from "@/lib/types";

interface SavedNamesSectionProps {
  savedNames: SavedNameData[];
  onNameClick: (name: SavedNameData) => void;
}

export default function SavedNamesSection({
  savedNames,
  onNameClick,
}: SavedNamesSectionProps) {
  if (savedNames.length === 0) return null;

  // Group names by gender
  const boyNames = savedNames.filter((name) => name.gender === "boy");
  const girlNames = savedNames.filter((name) => name.gender === "girl");

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookmarkCheck className="h-5 w-5 text-green-500" />
          Your Saved Names
        </CardTitle>
        <CardDescription>
          Names you've saved for later consideration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Boy Names Section */}
        {boyNames.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-blue-700">Boy Names</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {boyNames.map((name: SavedNameData, index: number) => (
                <Badge
                  key={`boy-${index}`}
                  variant="secondary"
                  className="text-sm py-1 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onNameClick(name)}
                >
                  {name.firstName} {name.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Girl Names Section */}
        {girlNames.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-pink-500" />
              <h3 className="font-semibold text-pink-700">Girl Names</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {girlNames.map((name: SavedNameData, index: number) => (
                <Badge
                  key={`girl-${index}`}
                  variant="secondary"
                  className="text-sm py-1 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onNameClick(name)}
                >
                  {name.firstName} {name.lastName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
