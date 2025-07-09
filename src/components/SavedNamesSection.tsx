"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookmarkCheck } from "lucide-react";
import { SavedNameData } from "@/lib/database";

interface SavedNamesSectionProps {
  savedNames: SavedNameData[];
  onNameClick: (name: SavedNameData) => void;
}

export default function SavedNamesSection({
  savedNames,
  onNameClick,
}: SavedNamesSectionProps) {
  if (savedNames.length === 0) return null;

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
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {savedNames.map((name: SavedNameData, index: number) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-sm py-1 px-3 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => onNameClick(name)}
            >
              {name.firstName} {name.lastName}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
