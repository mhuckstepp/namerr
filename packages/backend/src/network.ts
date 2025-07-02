import Replicate from "replicate";
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const model = "meta/meta-llama-3-70b-instruct";

export const getNameRating = async (name: string) => {
  const input = {
    top_p: 0.9,
    prompt: `Rate the name "${name}" from 0 to 100 based on its aesthetic appeal and provide a brief explanation (1-2 sentences) of why it's good or bad.

Format your response exactly like this:
Rating: [number]
Explanation: [brief explanation]

Keep the explanation concise and focused on the name's aesthetic qualities.`,
    min_tokens: 0,
    temperature: 0.3, // Lower temperature for more consistent formatting
    presence_penalty: 0.1, // Lower presence penalty to reduce verbosity
  };

  console.log("Asking for response", Date.now());
  try {
    const output = await replicate.run(model, { input });
    console.log({ output }, "@@@");

    // Parse the response to extract rating and explanation
    const response = Array.isArray(output) ? output.join("") : String(output);
    const ratingMatch = response.match(/Rating:\s*(\d+)/);
    const explanationMatch = response.match(/Explanation:\s*(.+)/);

    return {
      rating: ratingMatch ? parseInt(ratingMatch[1]) : null,
      explanation: explanationMatch ? explanationMatch[1].trim() : null,
      rawResponse: response,
    };
  } catch (error) {
    console.error({ error }, "@@@");
    return { rating: null, explanation: null, rawResponse: null };
  }
};
