import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import systemPrompt from "@/app/lib/prompt";

export async function POST(req: Request) {
  
  try {
    const { messages, data } = await req.json();
    const { interviewerPrompt, editorPrompt } = data;
    console.log(interviewerPrompt, editorPrompt);
    const prompt = `${interviewerPrompt}\n\n${editorPrompt}`;
  
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
          description: systemPrompt.tools.reviewExperience.description,
        
          inputSchema: z.object({
            title: z.string().describe(systemPrompt.tools.reviewExperience.parameters.title.description),
            experience: z.string().describe(systemPrompt.tools.reviewExperience.parameters.experience.description),
            pildoras: z.array(z.string()).describe(systemPrompt.tools.reviewExperience.parameters.pildoras.description),
            reflection: z.string().describe(systemPrompt.tools.reviewExperience.parameters.reflection.description),
            story_valuable: z.string().describe(systemPrompt.tools.reviewExperience.parameters.story_valuable.description),
          }),
        
          execute: async ({ title, experience, pildoras, reflection, story_valuable }) => {
            return {
              success: true,
              title,
              experience,
              pildoras,
              reflection,
              story_valuable,
            };
          },
        },
      },
    });

  return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return Response.json({ error: "Failed to stream text." }, { status: 500 });
  }
}