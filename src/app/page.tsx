"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AuthSection from "@/components/AuthSection";
import HeaderSection from "@/components/HeaderSection";
import NameInputForm from "@/components/NameInputForm";
import NameResults from "@/components/NameResults";
import SavedNamesSection from "@/components/SavedNamesSection";
import { RateNameResponse, SavedNameData, Gender } from "@/lib/types";
import { getNameInfo } from "@/app/network";
import NameResultsSkeleton from "@/components/NameResultsSkeleton";
import { isSameName } from "./utils";

export default function BabyNameHelper() {
  const { data: session } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState(Gender.FEMALE);
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
    setLoading(true);
    const ratingResponse = await getNameInfo({
      firstName: results.firstName,
      lastName: results.lastName,
      gender: results.gender,
      isSaved: isNameSaved,
      refresh: true,
    });
    const response: SavedNameData = await ratingResponse;
    setResults(response);
    setLoading(false);
    setSavedNames(
      savedNames.map((name) => (isSameName(name, results) ? response : name))
    );
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
      const ratingResponse = await getNameInfo({
        firstName,
        lastName,
        gender,
        isSaved: false,
        refresh: false,
      });

      const response: SavedNameData = await ratingResponse;
      console.log("handleSubmit", { response });
      setResults(response);
    } catch (err) {
      console.error(err);
      setError("Failed to get name suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isNameSaved = savedNames.some(
    (name) =>
      name.firstName.toLowerCase() === results?.firstName.toLowerCase() &&
      name.lastName.toLowerCase() === results?.lastName.toLowerCase() &&
      name.gender === results?.gender
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
          onGenderChange={(value) => {
            // Don't allow the gender to be set to null
            if (value) {
              setGender(value as Gender);
            }
          }}
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />

        {loading && <NameResultsSkeleton />}

        {/* Results */}
        {!loading && results && (
          <NameResults
            results={results}
            onSetName={setFirstName}
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
            setSavedNames={setSavedNames}
            onNameClick={handleSavedNameClick}
          />
        )}
      </div>
    </div>
  );
}
