"use client";

import type React from "react";
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
import { Sparkles, Heart, Baby } from "lucide-react";

interface NameInputFormProps {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function NameInputForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
  onSubmit,
  loading,
  error,
}: NameInputFormProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Let's Name!
        </CardTitle>
        <CardDescription>
          Enter a name you're considering and we'll give you some feedback
          suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="e.g., Emma, Oliver"
                value={firstName}
                onChange={(e) => onFirstNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="e.g., Smith, Johnson"
                value={lastName}
                onChange={(e) => onLastNameChange(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 flex items-center gap-1">
                  <Heart
                    className="h-4 w-4 animate-bounce-gentle text-pink-500"
                    style={{ animationDelay: "0ms" }}
                  />
                  <Sparkles
                    className="h-4 w-4 animate-pulse-sparkle text-yellow-500"
                    style={{ animationDelay: "200ms" }}
                  />
                  <Baby
                    className="h-4 w-4 animate-wiggle text-blue-500"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
                Getting suggestions...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Tell me about my name
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
