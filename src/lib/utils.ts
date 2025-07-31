import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function hashPromptConfig(
  prompt: string,
  modelName: string,
  topP: number,
  minTokens: number,
  temperature: number,
  presencePenalty: number
): string {
  // Create a string with all the configuration parameters
  const configString = `${prompt}|${modelName}|${topP}|${minTokens}|${temperature}|${presencePenalty}`;

  // Create SHA-256 hash
  return crypto.createHash("sha256").update(configString).digest("hex");
}
