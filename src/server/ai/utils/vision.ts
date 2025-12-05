import { extractResponseJson, openAIclient } from "./openai";

export async function extractDetailsFromImage<T>(
  imageUrl: string,
  prompt: string,
  isString?: boolean,
) {
  const chatCompletion = await openAIclient.chat.completions.create({
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
            },
          },
        ],
      },
    ],
    model: "gpt-4.1",
  });

  const responseMessage = chatCompletion.choices[0]?.message.content;

  if (!responseMessage) {
    throw new Error("no message found");
  }

  if (isString) {
    return { result: responseMessage };
  }

  const result = extractResponseJson<T>(responseMessage);

  return { result };
}
