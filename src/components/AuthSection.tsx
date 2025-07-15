"use client";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AuthSection() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [shareURL, setShareURL] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (status === "loading") {
    return null;
  }

  // Auto-copy to clipboard when dialog opens
  useEffect(() => {
    if (isDialogOpen && shareURL) {
      navigator.clipboard.writeText(shareURL).catch((err) => {
        console.error("Failed to copy to clipboard:", err);
      });
    }
  }, [isDialogOpen, shareURL]);

  const getShareURL = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/share-family");
      if (!response.ok) {
        throw new Error("Failed to get share URL");
      }
      const data = await response.json();
      setShareURL(data.shareURL);
      setIsDialogOpen(true);
    } catch (error) {
      console.error("Error getting share URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-end">
      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {session.user?.name || session.user?.email}!
          </span>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={getShareURL}
                disabled={isLoading}
              >
                <User className="h-4 w-4 mr-2" />
                {isLoading ? "Loading..." : "Share Link"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Share Family Link</DialogTitle>
                <DialogDescription>
                  Link copied to clipboard! Share it with your family members.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <input
                    type="text"
                    value={shareURL || ""}
                    readOnly
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Loading share URL..."
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="px-3 bg-green-500 hover:bg-green-600 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut()}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => signIn("google")}
          size="sm"
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Sign In to Save Names
        </Button>
      )}
    </div>
  );
}
