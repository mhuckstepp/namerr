import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NameResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Name Rating Card Skeleton */}
      <Card className="shadow-lg">
        <CardContent>
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Middle Name Suggestions Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-20" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Similar Names Skeleton */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-6 w-28" />
            </CardTitle>
            <Skeleton className="h-4 w-40" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
