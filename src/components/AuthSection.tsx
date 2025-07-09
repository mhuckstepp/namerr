"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, LogOut } from "lucide-react";

export default function AuthSection() {
  const { data: session, status } = useSession();

  return (
    <div className="flex justify-end">
      {status === "loading" ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Welcome, {session.user?.name || session.user?.email}!
          </span>
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
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Sign In to Save Names
        </Button>
      )}
    </div>
  );
}
