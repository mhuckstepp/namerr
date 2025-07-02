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
}

export interface SuggestMiddleNamesRequest {
  firstName: string;
  lastName: string;
  style?: string;
}

export interface SuggestMiddleNamesResponse {
  middleNames: string[];
}

export interface SuggestSimilarNamesRequest {
  firstName: string;
  lastName: string;
  style?: string;
}

export interface SuggestSimilarNamesResponse {
  similarNames: string[];
}

export interface NameResults {
  rating: NameRating;
  middleNames: string[];
  similarNames: string[];
}
