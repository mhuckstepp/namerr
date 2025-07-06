import Replicate from "replicate";
import { RateNameResponse } from "./types";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model = "meta/meta-llama-3.1-405b-instruct";

export const getNameRating = async (
  name: string,
  style: string | undefined
): Promise<RateNameResponse> => {
  const prompt = `Here is a baby name: "${name}". Provide a brief explanation (1-2 sentences) of why it's good or bad. Focus on the name's aesthetic qualities and how the first name fits with the last name. Only focus on the first name because the last name cannot be changed. ${
    style != "none" ? `The style requested is ${style}. So please take that into account` : ""
  }

  Also provide a brief explanation of the name's origin.

  Don't be afraid to be critical. Keep the explanation concise and focused on the name's aesthetic qualities.

  Suggest 4-6 middle names that would go well with the name.
  Suggest 4-6 similar names that would go well with the name.

  Format your response exactly like this so it can be parsed:
  --Explanation--: [brief explanation]
  --Origin--: [brief explanation of the name's origin]
  --Middle names--: [list of middle names]
  --Similar names--: [list of similar names]

  Here is an example of a good response:
  --Explanation--: "The name is unique and has a nice flow to it. It's a good fit for a boy."
  --Origin--: "The name is of Greek origin and means 'God's gift'."
  --Middle names--: James, John, Robert, Michael, David
  --Similar names--: John, Robert, Michael, David, James
  `;

  const input = {
    top_p: 0.9,
    prompt,
    min_tokens: 0,
    temperature: 0.3,
    presence_penalty: 0.1,
  };

  try {
    const output = await replicate.run(model, { input });

    const response = Array.isArray(output) ? output.join("") : String(output);
    const explanationMatch = response.match(/--Explanation--:\s*(.+)/);
    const middleNamesMatch = response.match(/--Middle names--:\s*(.+)/);
    const similarNamesMatch = response.match(/--Similar names--:\s*(.+)/);
    const originMatch = response.match(/--Origin--:\s*(.+)/);

    const middleNames = middleNamesMatch
      ? middleNamesMatch[1].trim().split(",")
      : [];
    const similarNames = similarNamesMatch
      ? similarNamesMatch[1].trim().split(",")
      : [];

    return {
      feedback: explanationMatch ? explanationMatch[1].trim() : null,
      origin: originMatch ? originMatch[1].trim() : null,
      middleNames,
      similarNames,
    };
  } catch (error) {
    console.error("Error rating name", error);
    return {
      feedback: null,
      origin: null,
      middleNames: [],
      similarNames: [],
    };
  }
};
