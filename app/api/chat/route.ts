import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export async function POST(req: Request) {
  
  try {
    const { messages, data } = await req.json();
    const { interviewerPrompt, editorPrompt } = data;
    const prompt = `${interviewerPrompt}\n\n${editorPrompt}\n\n Si escribo "BETLEM" crea una experiencia de prueba y ejecuta la tool reviewExperience
    `;
  
    const result = streamText({
      model: anthropic("claude-sonnet-4-20250514"),
      messages: [
          {
              role: 'system',
              content: prompt.trim()
          },
          ...(await convertToModelMessages(messages)),
      ],
      tools: {
        reviewExperience: {
          description: `${editorPrompt}`,
        
          inputSchema: z.object({
            title: z.string(),
            experience: z.string(),
            pildoras: z.array(z.string()),
            reflection: z.string(),
            story_valuable: z.string(),
          }),

          execute: async (params) => params,
        },
      },
    });

  return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return Response.json({ error: "Failed to stream text." }, { status: 500 });
  }
}