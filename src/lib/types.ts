export interface NameRating {
  score: number;
  feedback: string;
}

export interface RateNameRequest {
  firstName: string;
  lastName: string;
}

// API response - just the metadata without the names
export interface RateNameResponse {
  origin: string | null;
  feedback: string | null;
  middleNames: string[];
  similarNames: string[];
}

export interface ErrorResponse {
  error: string;
}
