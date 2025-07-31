export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface NameRating {
  score: number;
  feedback: string;
}

export interface RateNameRequest {
  firstName: string;
  lastName: string;
  gender: string;
  refresh: boolean;
  isSaved: boolean;
}

// Unified type for name data throughout the app
export interface NameData {
  // Core name fields
  firstName: string;
  lastName: string;
  fullName?: string;
  gender: string;

  // Rating/feedback fields
  origin: string | null;
  feedback: string | null;
  popularity: string | null;
  middleNames: string[];
  similarNames: string[];

  // Database fields (optional for API responses)
  id?: string;
  userId?: string;
  familyId?: string;
  savedAt?: Date;
  rank?: number;
  promptId?: string;
}

export interface RateNameResponse
  extends Pick<
    NameData,
    | "firstName"
    | "lastName"
    | "gender"
    | "origin"
    | "feedback"
    | "popularity"
    | "middleNames"
    | "similarNames"
    | "promptId"
  > {}

// Database type - extends NameData with all fields
export interface SavedNameData extends NameData {}

export interface ErrorResponse {
  error: string;
}

export interface PromptHistoryEntry {
  id: string;
  prompt: string;
  topP: number;
  minTokens: number;
  temperature: number;
  presencePenalty: number;
  modelName: string;
  usageCount: number;
  firstUsed: Date;
  lastUsed: Date;
}

export interface PromptHistoryResponse {
  entries: PromptHistoryEntry[];
  total: number;
  page: number;
  pageSize: number;
}

// Prompt Feedback Types
export interface PromptFeedbackData {
  // Core feedback fields
  analysisFeedback?: string;
  analysisFeedbackQuant?: number;
  originFeedback?: string;
  originFeedbackQuant?: number;
  popularityFeedback?: string;
  popularityFeedbackQuant?: number;
  similarNamesFeedback?: string;
  similarNamesFeedbackQuant?: number;
  middleNamesFeedback?: string;
  middleNamesFeedbackQuant?: number;
}

export interface PromptFeedbackRequest {
  promptId: string;
  feedback: PromptFeedbackData;
}

export interface PromptFeedbackResponse {
  success: boolean;
  error?: string;
}
