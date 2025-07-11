export interface NameRating {
  score: number;
  feedback: string;
}

export interface RateNameRequest {
  firstName: string;
  lastName: string;
  gender: string; // "boy" or "girl"
  refresh: boolean;
}

// Unified type for name data throughout the app
export interface NameData {
  // Core name fields
  firstName: string;
  lastName: string;
  fullName?: string;
  gender: string; // "boy" or "girl"

  // Rating/feedback fields
  origin: string | null;
  feedback: string | null;
  popularity: string | null;
  middleNames: string[];
  similarNames: string[];

  // Database fields (optional for API responses)
  id?: string;
  userId?: string;
  savedAt?: Date;
}

// API response type - extends NameData but makes database fields optional
export interface RateNameResponse
  extends Pick<
    NameData,
    "origin" | "feedback" | "popularity" | "middleNames" | "similarNames"
  > {}

// Database type - extends NameData with all fields
export interface SavedNameData extends NameData {}

export interface ErrorResponse {
  error: string;
}
