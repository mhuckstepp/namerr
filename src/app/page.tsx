"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sparkles,
  Users,
  Loader2,
  Bookmark,
  BookmarkCheck,
  LogIn,
  LogOut,
} from "lucide-react";
import { RateNameResponse } from "@/lib/types";

interface NameResults {
  firstName: string;
  lastName: string;
  feedback: string | null;
  origin: string | null;
  middleNames: string[];
  similarNames: string[];
}

const styles = [
  { value: "none", label: "None", icon: "🤷" },
  { value: "classic", label: "Classic", icon: "🏛️" },
  { value: "artsy", label: "Artsy", icon: "🎨" },
  { value: "polite", label: "Polite", icon: "🎩" },
  { value: "unique", label: "Unique", icon: "✨" },
  { value: "modern", label: "Modern", icon: "🚀" },
  { value: "nature", label: "Nature", icon: "🌿" },
  { value: "funny", label: "Funny", icon: "😂" },
  { value: "cool", label: "Cool", icon: "🤘" },
];

export default function BabyNameHelper() {
  const { data: session, status } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(styles[0].value);
  const [results, setResults] = useState<NameResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [savingName, setSavingName] = useState(false);

  // Load saved names when user is authenticated
  useEffect(() => {
    if (session?.user === undefined) return;

    loadSavedNames();

    if (lastName === "") {
      const fullName = session?.user?.name || "";
      const lastWord = fullName.split(" ").pop() || "";
      setLastName(lastWord);
    }
  }, [session]);

  const loadSavedNames = async () => {
    try {
      const response = await fetch("/api/saved-names");
      if (response.ok) {
        const data = await response.json();
        setSavedNames(data.names || []);
      }
    } catch (error) {
      console.error("Error loading saved names:", error);
    }
  };

  const saveName = async (name: string) => {
    if (!session?.user) return;

    setSavingName(true);
    try {
      const response = await fetch("/api/save-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setSavedNames((prev) => [...prev, name]);
      }
    } catch (error) {
      console.error("Error saving name:", error);
    } finally {
      setSavingName(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !selectedStyle) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ratingResponse = await fetch("/api/rate-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, style: selectedStyle }),
      });

      // Parse the actual responses
      const response: RateNameResponse = await ratingResponse.json();

      const results: NameResults = {
        firstName,
        lastName,
        origin: response.origin,
        feedback: response.feedback,
        middleNames: response.middleNames,
        similarNames: response.similarNames || [],
      };

      setResults(results);
    } catch (err) {
      console.error(err);
      setError("Failed to get name suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isNameSaved = (name: string) => savedNames.includes(name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          {/* Auth Section - Top Right */}
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

          {/* Header */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex items-center justify-center gap-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                Namerr
              </h1>
              <Heart className="h-8 w-8 text-pink-500" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect name for your little one. Get suggestions,
              feedback and discover similar names that match your style.
            </p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Let's Name!
            </CardTitle>
            <CardDescription>
              Enter the names you're considering and choose a style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="e.g., Emma, Oliver"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="e.g., Smith, Johnson"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Name Style</Label>
                <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a style that fits your family" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        <span className="flex items-center gap-2">
                          <span>{style.icon}</span>
                          {style.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting suggestions...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get Name Suggestions
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Name Rating */}
            <Card className="shadow-lg">
              <CardContent>
                <div className="space-y-4 mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold">
                      {firstName} {lastName}
                    </div>
                    {session && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => saveName(`${firstName} ${lastName}`)}
                        disabled={
                          savingName || isNameSaved(`${firstName} ${lastName}`)
                        }
                        className="flex items-center gap-2"
                      >
                        {savingName ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isNameSaved(`${firstName} ${lastName}`) ? (
                          <BookmarkCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                        {isNameSaved(`${firstName} ${lastName}`)
                          ? "Saved"
                          : "Save Name"}
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
                    {results.middleNames?.map((name, index) => (
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
                    {results.similarNames?.map((name, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                      >
                        {name} {lastName}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Saved Names Section */}
          </div>
        )}
        {session && savedNames.length > 0 && (
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
                {savedNames.map((name, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm py-1 px-3"
                  >
                    {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
