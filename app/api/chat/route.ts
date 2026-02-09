import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export async function POST(req: Request) {
  
  try {
    const { messages, data } = await req.json();
    const { interviewerPrompt, editorPrompt } = data;
    const prompt = `${interviewerPrompt}\n\n
    
    IMPORTANTE: Cuando determines que tienes suficiente información para crear una experiencia completa, 
responde EXACTAMENTE este texto: "[WANNA_REVIEW_READY]"

No agregues nada más después de ese mensaje. Ese será el indicador para procesar la conversación.

    Si el usuario escribe "BETLEM", significa que quiere creas una experiencia de prueba inmediatamente, 
así que responde directamente "[WANNA_REVIEW_READY]"
    
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
      /* tools: {
        reviewExperience: {
          description: `${editorPrompt} No necesitas llenar los campos, solo ejecuta la tool como señal.`,
        
          inputSchema: z.object({
            title: z.string(),
            experience: z.string(),
            pildoras: z.array(z.string()),
            reflection: z.string(),
            story_valuable: z.string(),
          }),

          execute: async (params) => params,
        },
      }, */
    });

  return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return Response.json({ error: "Failed to stream text." }, { status: 500 });
  }
}