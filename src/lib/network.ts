import Replicate from "replicate";
import { RateNameResponse } from "./types";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model = "meta/meta-llama-3.1-405b-instruct";

export const getNameRating = async (
  firstName: string,
  lastName: string,
  gender: string
): Promise<RateNameResponse> => {
  const prompt = `Analyze the baby name "${firstName} ${lastName}" for a ${gender}.

Return ONLY a valid JSON object with this exact structure - no additional text, no explanations:

{
  "feedback": "Brief explanation of why the name is good or bad (1-2 sentences)",
  "origin": "Brief explanation of the first name's origin",
  "popularity": "Brief explanation of the first name's popularity historically and currently", 
  "middleNames": ["name1", "name2", "name3", "name4"],
  "similarNames": ["name1", "name2", "name3", "name4"]
}

Rules:
- Return ONLY the JSON object, no other text
- Only include information about origin and popularity related to the first name
- Be critical and honest about the name's qualities
- Suggest 6-8 middle names that complement the first name
- Suggest 6-8 similar names as alternatives
- Keep all explanations concise and focused on aesthetic qualities`;

  const input = {
    top_p: 0.9,
    prompt,
    min_tokens: 0,
    temperature: 0.35,
    presence_penalty: 0.1,
  };
  const output = await replicate.run(model, { input });

  const response = Array.isArray(output) ? output.join("") : String(output);

  let jsonString = response.trim();

  const parsed = JSON.parse(jsonString);

  return {
    feedback: parsed.feedback || null,
    origin: parsed.origin || null,
    popularity: parsed.popularity || null,
    middleNames: Array.isArray(parsed.middleNames) ? parsed.middleNames : [],
    similarNames: Array.isArray(parsed.similarNames) ? parsed.similarNames : [],
  };
};
