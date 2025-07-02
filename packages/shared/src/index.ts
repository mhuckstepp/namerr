// Shared types for the Namerr application

export interface NameRequest {
  firstName: string;
  lastName: string;
  style: string;
}

export interface NameRating {
  score: number;
  feedback: string;
}

export interface NameSuggestions {
  middleNames: string[];
  similarNames: string[];
}

export interface NameResults {
  rating: NameRating;
  middleNames: string[];
  similarNames: string[];
}

export type NameStyle =
  | "artsy"
  | "polite"
  | "unique"
  | "classic"
  | "modern"
  | "nature";

export const NAME_STYLES = [
  { value: "artsy", label: "Artsy", icon: "🎨" },
  { value: "polite", label: "Polite", icon: "🎩" },
  { value: "unique", label: "Unique", icon: "✨" },
  { value: "classic", label: "Classic", icon: "👑" },
  { value: "modern", label: "Modern", icon: "🚀" },
  { value: "nature", label: "Nature", icon: "🌿" },
] as const;

export * from "./types";
