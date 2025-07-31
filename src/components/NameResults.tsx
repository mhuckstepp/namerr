"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Sparkles,
  Loader2,
  Bookmark,
  BookmarkCheck,
  RefreshCcw,
  MessageSquare,
  X,
} from "lucide-react";
import { PromptFeedbackData, SavedNameData } from "@/lib/types";
import { useState } from "react";

interface NameResultsProps {
  results: SavedNameData;
  onSetName: (firstName: string) => void;
  onSaveName: () => void;
  refreshResults: () => void;
  savingName: boolean;
  isNameSaved: boolean;
}

const FeedbackSection = ({
  title,
  description,
  feedbackField,
  quantField,
  feedback,
  onFeedbackChange,
  isOpen,
  onClose,
}: {
  title: string;
  description: string;
  feedbackField: keyof PromptFeedbackData;
  quantField: keyof PromptFeedbackData;
  feedback: PromptFeedbackData;
  onFeedbackChange: (
    field: keyof PromptFeedbackData,
    value: string | number | undefined
  ) => void;
  isOpen: boolean;
  onClose: () => void;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="flex items-center gap-2"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>

    {isOpen && (
      <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
        <div className="space-y-2">
          <Label htmlFor={`${feedbackField}-input`} className="text-sm">
            Comments (optional)
          </Label>
          <textarea
            id={`${feedbackField}-input`}
            value={(feedback[feedbackField] as string) || ""}
            onChange={(e) => onFeedbackChange(feedbackField, e.target.value)}
            className="w-full p-2 text-sm border rounded-md resize-none"
            rows={2}
            placeholder="Share your thoughts..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">
            Rating: {(feedback[quantField] as number) || 0}/5
          </Label>
          <Slider
            value={[(feedback[quantField] as number) || 0]}
            onValueChange={(value) => onFeedbackChange(quantField, value[0])}
            max={5}
            min={0}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Poor</span>
            <span>Fair</span>
            <span>Good</span>
            <span>Very Good</span>
            <span>Excellent</span>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default function NameResults({
  results,
  onSetName,
  onSaveName,
  refreshResults,
  savingName,
  isNameSaved,
}: NameResultsProps) {
  const { data: session } = useSession();
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showAllFeedback, setShowAllFeedback] = useState(false);
  const [feedback, setFeedback] = useState<PromptFeedbackData>({
    analysisFeedback: "",
    analysisFeedbackQuant: undefined,
    originFeedback: "",
    originFeedbackQuant: undefined,
    popularityFeedback: "",
    popularityFeedbackQuant: undefined,
    similarNamesFeedback: "",
    similarNamesFeedbackQuant: undefined,
    middleNamesFeedback: "",
    middleNamesFeedbackQuant: undefined,
  });

  const handleFeedbackChange = (
    field: keyof PromptFeedbackData,
    value: string | number | undefined
  ) => {
    setFeedback((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitFeedback = async () => {
    console.log("handleSubmitFeedback", results.promptId);
    if (!results.promptId) return;

    setIsSubmittingFeedback(true);
    try {
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: results.promptId,
          feedback,
        }),
      });

      if (response.ok) {
        // Reset feedback form
        setFeedback({
          analysisFeedback: "",
          analysisFeedbackQuant: undefined,
          originFeedback: "",
          originFeedbackQuant: undefined,
          popularityFeedback: "",
          popularityFeedbackQuant: undefined,
          similarNamesFeedback: "",
          similarNamesFeedbackQuant: undefined,
          middleNamesFeedback: "",
          middleNamesFeedbackQuant: undefined,
        });
        setShowAllFeedback(false);
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Name Rating */}
      <Card className="shadow-lg">
        <CardContent>
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold">
                {results.firstName} {results.lastName}
              </div>
              {session && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllFeedback(!showAllFeedback)}
                    className="flex items-center gap-2"
                  >
                    {showAllFeedback ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <MessageSquare className="h-4 w-4" />
                    )}
                    {showAllFeedback ? "Hide Feedback" : "Give Feedback"}
                  </Button>
                  {showAllFeedback && (
                    <Button
                      onClick={handleSubmitFeedback}
                      disabled={isSubmittingFeedback}
                      className="flex items-center gap-2"
                    >
                      {isSubmittingFeedback ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                      Submit All Feedback
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onSaveName}
                    disabled={savingName || isNameSaved}
                    className="flex items-center gap-2"
                  >
                    {savingName ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isNameSaved ? (
                      <BookmarkCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                    {isNameSaved ? "Saved" : "Save Name"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshResults}
                    className="flex items-center gap-2"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-muted-foreground">{results.feedback}</p>
                {session && showAllFeedback && (
                  <FeedbackSection
                    title="Overall Analysis"
                    description="How helpful was the overall name analysis?"
                    feedbackField="analysisFeedback"
                    quantField="analysisFeedbackQuant"
                    feedback={feedback}
                    onFeedbackChange={handleFeedbackChange}
                    isOpen={true}
                    onClose={() => setShowAllFeedback(false)}
                  />
                )}
              </div>

              <div>
                <div className="text-lg font-bold">Origin:</div>
                <p className="text-muted-foreground">{results.origin}</p>
                {session && showAllFeedback && (
                  <FeedbackSection
                    title="Origin Information"
                    description="How accurate and interesting was the origin information?"
                    feedbackField="originFeedback"
                    quantField="originFeedbackQuant"
                    feedback={feedback}
                    onFeedbackChange={handleFeedbackChange}
                    isOpen={true}
                    onClose={() => setShowAllFeedback(false)}
                  />
                )}
              </div>

              {results.popularity && (
                <div>
                  <div className="text-lg font-bold">Popularity:</div>
                  <p className="text-muted-foreground">{results.popularity}</p>
                  {session && showAllFeedback && (
                    <FeedbackSection
                      title="Popularity Data"
                      description="How useful was the popularity information?"
                      feedbackField="popularityFeedback"
                      quantField="popularityFeedbackQuant"
                      feedback={feedback}
                      onFeedbackChange={handleFeedbackChange}
                      isOpen={true}
                      onClose={() => setShowAllFeedback(false)}
                    />
                  )}
                </div>
              )}
            </div>
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
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {results.middleNames?.map((name: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {results.firstName} {name} {results.lastName}
                </Badge>
              ))}
            </div>

            {session && showAllFeedback && (
              <FeedbackSection
                title="Middle Name Ideas"
                description="How good were the middle name suggestions?"
                feedbackField="middleNamesFeedback"
                quantField="middleNamesFeedbackQuant"
                feedback={feedback}
                onFeedbackChange={handleFeedbackChange}
                isOpen={true}
                onClose={() => setShowAllFeedback(false)}
              />
            )}
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
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {results.similarNames?.map((name: string, index: number) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-sm py-1 px-3 hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
                  onClick={() => onSetName(name)}
                >
                  {name} {results.lastName}
                </Badge>
              ))}
            </div>

            {session && showAllFeedback && (
              <FeedbackSection
                title="Similar Names"
                description="How relevant were the similar name suggestions?"
                feedbackField="similarNamesFeedback"
                quantField="similarNamesFeedbackQuant"
                feedback={feedback}
                onFeedbackChange={handleFeedbackChange}
                isOpen={true}
                onClose={() => setShowAllFeedback(false)}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
