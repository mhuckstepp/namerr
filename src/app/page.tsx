"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthSection from "@/components/AuthSection";
import HeaderSection from "@/components/HeaderSection";
import NameInputForm from "@/components/NameInputForm";
import NameResults from "@/components/NameResults";
import SavedNamesSection from "@/components/SavedNamesSection";
import { RateNameResponse, SavedNameData } from "@/lib/types";
import { getNameInfo } from "@/app/network";

export default function BabyNameHelper() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("boy");
  const [results, setResults] = useState<SavedNameData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedNames, setSavedNames] = useState<SavedNameData[]>([]);
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

  const saveName = async () => {
    if (!session?.user || !results) return;

    setSavingName(true);
    try {
      const response = await fetch("/api/save-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          gender,
          metadata: results,
        }),
      });

      if (response.ok) {
        // Reload saved names to get the updated list
        await loadSavedNames();
      }
    } catch (error) {
      console.error("Error saving name:", error);
      setError("Failed to save name. Please try again.");
    } finally {
      setSavingName(false);
    }
  };

  const refreshResults = async () => {
    if (!results) return;
    const ratingResponse = await getNameInfo(
      results.firstName,
      results.lastName,
      results.gender,
      true
    );
    const response: SavedNameData = await ratingResponse;
    setResults(response);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const ratingResponse = await getNameInfo(
        firstName,
        lastName,
        gender,
        false
      );

      // Parse the actual responses
      const response: RateNameResponse = await ratingResponse;

      const results: SavedNameData = {
        firstName,
        lastName,
        gender,
        origin: response.origin,
        feedback: response.feedback,
        popularity: response.popularity,
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

  const isNameSaved = savedNames.some(
    (name) =>
      name.firstName.toLowerCase() === firstName.toLowerCase() &&
      name.lastName.toLowerCase() === lastName.toLowerCase() &&
      name.gender === gender
  );

  const handleSavedNameClick = (name: SavedNameData) => {
    setResults(name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <AuthSection />
          <HeaderSection />
        </div>

        <NameInputForm
          firstName={firstName}
          lastName={lastName}
          gender={gender}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onGenderChange={setGender}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {/* Results */}
        {results && (
          <NameResults
            results={results}
            onSaveName={saveName}
            refreshResults={refreshResults}
            savingName={savingName}
            isNameSaved={isNameSaved}
          />
        )}

        {/* Saved Names Section */}
        {session && (
          <SavedNamesSection
            savedNames={savedNames}
            onNameClick={handleSavedNameClick}
          />
        )}
      </div>
    </div>
  );
}
