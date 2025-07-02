import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model = "meta/meta-llama-3-70b-instruct";

export const getNameRating = async (
  name: string,
  style: string | undefined
) => {
  const prompt = `Rate the name "${name}" from 1 to 100 based on its aesthetic appeal and provide a brief explanation (1-2 sentences) of why it's good or bad. Focus on the name's aesthetic qualities and how the first name fits with the last name. Only focus on the first name because the last name cannot be changed.

  Don't be afraid to be critical or score the name low. Keep the explanation concise and focused on the name's aesthetic qualities.

  The person's style is ${style}, so take this into account when rating the name.

  Suggest 4-6 middle names that would go well with the name.
  Suggest 4-6 similar names that would go well with the name.

  Format your response exactly like this so it can be parsed:
  --Rating--: [number]
  --Explanation--: [brief explanation]
  --Middle names--: [list of middle names]
  --Similar names--: [list of similar names]

  Here is an example of a good response:
  --Rating--: 68
  --Explanation--: "The name is unique and has a nice flow to it. It's a good fit for a boy."
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
    const ratingMatch = response.match(/--Rating--:\s*(\d+)/);
    const explanationMatch = response.match(/--Explanation--:\s*(.+)/);
    const middleNamesMatch = response.match(/--Middle names--:\s*(.+)/);
    const similarNamesMatch = response.match(/--Similar names--:\s*(.+)/);

    const middleNames = middleNamesMatch
      ? middleNamesMatch[1].trim().split(",")
      : [];
    const similarNames = similarNamesMatch
      ? similarNamesMatch[1].trim().split(",")
      : [];

    return {
      rating: ratingMatch ? parseInt(ratingMatch[1]) : null,
      explanation: explanationMatch ? explanationMatch[1].trim() : null,
      middleNames,
      similarNames,
    };
  } catch (error) {
    return { rating: null, explanation: null };
  }
};
