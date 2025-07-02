"use client";

import type React from "react";

import { useState } from "react";
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
import { Heart, Sparkles, Users, Loader2 } from "lucide-react";
import {
  RateNameResponse,
  SuggestMiddleNamesResponse,
  SuggestSimilarNamesResponse,
} from "@shared/types";

interface NameResults {
  rating: {
    score: number;
    feedback: string;
  };
  middleNames: string[];
  similarNames: string[];
}

const styles = [
  { value: "artsy", label: "Artsy", icon: "🎨" },
  { value: "polite", label: "Polite", icon: "🎩" },
  { value: "unique", label: "Unique", icon: "✨" },
  { value: "classic", label: "Classic", icon: "👑" },
  { value: "modern", label: "Modern", icon: "🚀" },
  { value: "nature", label: "Nature", icon: "🌿" },
];

export default function BabyNameHelper() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedStyle, setSelectedStyle] = useState(styles[0].value);
  const [results, setResults] = useState<NameResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !selectedStyle) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Placeholder API calls - replace with your actual backend URLs
      const [ratingResponse, middleNamesResponse, similarNamesResponse] =
        await Promise.all([
          fetch("/api/rate-name", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, style: selectedStyle }),
          }),
          fetch("/api/suggest-middle-names", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, style: selectedStyle }),
          }),
          fetch("/api/suggest-similar-names", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, style: selectedStyle }),
          }),
        ]);

      // Parse the actual responses
      const ratingData: RateNameResponse = await ratingResponse.json();
      const middleNamesData: SuggestMiddleNamesResponse =
        await middleNamesResponse.json();
      const similarNamesData: SuggestSimilarNamesResponse =
        await similarNamesResponse.json();

      const results: NameResults = {
        rating: {
          score: ratingData.score,
          feedback: ratingData.feedback,
        },
        middleNames: middleNamesData.middleNames,
        similarNames: similarNamesData.similarNames,
      };

      setResults(results);
    } catch (err) {
      setError("Failed to get name suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Great";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
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
            Find the perfect name for your little one. Get AI-powered ratings,
            middle name suggestions, and discover similar names that match your
            style.
          </p>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Tell us about your name preferences
            </CardTitle>
            <CardDescription>
              Enter the names you're considering and choose a style that
              resonates with you
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getRatingColor(results.rating.score)}
                  >
                    {results.rating.score}/100
                  </Badge>
                  Name Rating - {getRatingLabel(results.rating.score)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-semibold">
                    {firstName} {lastName}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        results.rating.score >= 90
                          ? "bg-green-500"
                          : results.rating.score >= 75
                          ? "bg-blue-500"
                          : results.rating.score >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${results.rating.score}%` }}
                    />
                  </div>
                  <p className="text-muted-foreground">
                    {results.rating.feedback}
                  </p>
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
                    Perfect middle names for {firstName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {results.middleNames.map((name, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm py-1 px-3"
                      >
                        {firstName} {name} {lastName}
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
                    {results.similarNames.map((name, index) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
