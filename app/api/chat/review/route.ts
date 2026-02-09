import { streamObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export const experienceSchema = z.object({
  title: z.string(),
  experience: z.string(),
  pildoras: z.array(z.string()),
  reflection: z.string(),
  story_valuable: z.string(),
});

export async function POST(req: Request) {
  try {
    const { conversation, editorPrompt } = await req.json();

    if (!conversation || !editorPrompt) {
      return Response.json(
        { error: "Missing conversation or editorPrompt" }, 
        { status: 400 }
      );
    }

    const result = await streamObject({
      model: anthropic("claude-sonnet-4-20250514"),
      schema: experienceSchema,
      prompt: `${editorPrompt}

      Conversación completa:
      ${conversation}`,
      temperature: 0.3,
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("Error generating review", error);
    return Response.json(
      { error: "Failed to generate review." }, 
      { status: 500 }
    );
  }
}