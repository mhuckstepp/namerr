import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookmarkCheck, User, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SavedNamesSkeleton() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookmarkCheck className="h-5 w-5 text-green-500" />
          Your Saved Names
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Boy Names Section Skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold text-blue-700">Boy Names</h3>
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Girl Names Section Skeleton */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-pink-500" />
            <h3 className="font-semibold text-pink-700">Girl Names</h3>
          </div>
          <div className="flex flex-col gap-2">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
