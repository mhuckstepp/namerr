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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Sparkles, Heart, Baby, Mars, Venus } from "lucide-react";
import { Gender } from "@/lib/types";

interface NameInputFormProps {
  firstName: string;
  lastName: string;
  gender: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export default function NameInputForm({
  firstName,
  lastName,
  gender,
  onFirstNameChange,
  onLastNameChange,
  onGenderChange,
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
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            <div className="space-y-2 flex justify-start">
              <ToggleGroup
                variant={"outline"}
                type="single"
                value={gender}
                onValueChange={onGenderChange}
              >
                <ToggleGroupItem value={Gender.FEMALE} aria-label="Female">
                  <Venus className="h-4 w-4" />
                  Girl
                </ToggleGroupItem>
                <ToggleGroupItem value={Gender.MALE} aria-label="Male">
                  <Mars className="h-4 w-4" />
                  Boy
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 flex items-center gap-1">
                  <Baby className="h-4 w-4 text-blue-500" />
                </div>
                Looking at your name...
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
