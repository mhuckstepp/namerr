import Replicate from "replicate";
import { RateNameResponse } from "./types";
import { savePromptHistory } from "./database";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const getNameRating = async (
  firstName: string,
  lastName: string,
  gender: string
): Promise<RateNameResponse> => {
  // In your API route or server-side code
  const promptTemplate = process.env.PROMPT_STRING;
  const modelName = process.env.REPLICATE_MODEL_NAME as `${string}/${string}`;
  if (!promptTemplate || !modelName) {
    throw new Error("PROMPT_STRING or REPLICATE_MODEL_NAME is not set");
  }

  const prompt = promptTemplate
    .replace("--firstName--", firstName)
    .replace("--lastName--", lastName)
    .replace("--gender--", gender);

  const input = {
    top_p: 0.9,
    prompt,
    min_tokens: 0,
    temperature: 0.35,
    presence_penalty: 0.1,
  };
  const output = await replicate.run(modelName, {
    input,
  });

  const response = Array.isArray(output) ? output.join("") : String(output);

  let jsonString = response.trim();

  const parsed = JSON.parse(jsonString);

  savePromptHistory(
    prompt,
    modelName,
    input.top_p,
    input.min_tokens,
    input.temperature,
    input.presence_penalty
  );

  return {
    feedback: parsed.feedback || null,
    origin: parsed.origin || null,
    popularity: parsed.popularity || null,
    middleNames: Array.isArray(parsed.middleNames) ? parsed.middleNames : [],
    similarNames: Array.isArray(parsed.similarNames) ? parsed.similarNames : [],
  };
};
