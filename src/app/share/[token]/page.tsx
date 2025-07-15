"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import AuthSection from "@/components/AuthSection";
import HeaderSection from "@/components/HeaderSection";

export default function SharePage() {
  const { data: session, status } = useSession();

  const { token } = useParams<{ token: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const REDIRECT_DELAY = 2000; // 2 seconds

  useEffect(() => {
    if (status === "loading") return;

    // If user is authenticated, automatically try to join the family
    if (session?.user && token) {
      joinFamily();
    }
  }, [session, status, token]);

  const joinFamily = async () => {
    if (!session?.user || !token) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/join-family", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareToken: token }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, REDIRECT_DELAY);
      } else {
        setError(data.error || "Failed to join family");
      }
    } catch (error) {
      console.error("Error joining family:", error);
      setError("Failed to join family. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClick = () => {
    if (!session?.user) {
      signIn("google");
      return;
    }

    joinFamily();
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <AuthSection />
            <HeaderSection />
          </div>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <AuthSection />
          <HeaderSection />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {success ? (
            <div className="space-y-4">
              <div className="text-green-500 text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-gray-900">
                Successfully Joined Family!
              </h2>
              <p className="text-gray-600">
                You've been added to the family. Redirecting to the main page...
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-pulse text-pink-500 text-lg font-semibold">
                  Redirecting...
                </div>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-blue-500 text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <h2 className="text-2xl font-bold text-gray-900">
                Join Family Invitation
              </h2>
              <p className="text-gray-600 max-w-md mx-auto">
                You've been invited to join a family on Namerr. This will allow
                you to share and collaborate on baby name suggestions with your
                family members.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              {!session?.user ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Please sign in to join this family.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-600 text-sm">
                      Once you sign in, you'll automatically be added to the
                      family.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Ready to join the family, {session.user.name}?
                  </p>
                  <button
                    onClick={handleJoinClick}
                    disabled={loading}
                    className="bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Joining...</span>
                      </div>
                    ) : (
                      "Join Family"
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
