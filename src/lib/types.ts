export interface NameRating {
  score: number;
  feedback: string;
}

export interface RateNameRequest {
  firstName: string;
  lastName: string;
  style?: string;
}

export interface RateNameResponse {
  score: number;
  feedback: string;
  middleNames: string[];
  similarNames: string[];
}
export interface ErrorResponse {
  error: string;
}

export interface NameResults {
  rating: NameRating;
  middleNames: string[];
  similarNames: string[];
}
