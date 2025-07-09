"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Sparkles,
  Loader2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { SavedNameData } from "@/lib/database";

interface NameResultsProps {
  results: SavedNameData;
  onSaveName: () => void;
  savingName: boolean;
  isNameSaved: boolean;
}

export default function NameResults({
  results,
  onSaveName,
  savingName,
  isNameSaved,
}: NameResultsProps) {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      {/* Name Rating */}
      <Card className="shadow-lg">
        <CardContent>
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold">
                {results.firstName} {results.lastName}
              </div>
              {session && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSaveName}
                  disabled={savingName || isNameSaved}
                  className="flex items-center gap-2"
                >
                  {savingName ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isNameSaved ? (
                    <BookmarkCheck className="h-4 w-4 text-green-500" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {isNameSaved ? "Saved" : "Save Name"}
                </Button>
              )}
            </div>
            <p className="text-muted-foreground">{results.feedback}</p>
            <div className="text-xl font-bold">Origin:</div>
            <p className="text-muted-foreground">{results.origin}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Middle Name Suggestions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Middle Name Ideas
            </CardTitle>
            <CardDescription>
              Perfect middle names for {results.firstName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.middleNames?.map((name: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {results.firstName} {name} {results.lastName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Similar Names */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Similar Names
            </CardTitle>
            <CardDescription>Other names you might love</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {results.similarNames?.map((name: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                >
                  {name} {results.lastName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
