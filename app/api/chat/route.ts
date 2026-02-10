import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export async function POST(req: Request) {
  
  try {
    const { messages, data } = await req.json();
    const { interviewerPrompt, editorPrompt } = data;
    const prompt = `${interviewerPrompt}\n\n
    
    IMPORTANTE: Cuando determines que tienes suficiente información para crear una experiencia completa, 
responde EXACTAMENTE este texto: "...Wanna está generando tu historia..."

No agregues nada más después de ese mensaje. Ese será el indicador para procesar la conversación.

    Si el usuario escribe "BETLEM", significa que quiere creas una experiencia humana aleatoria de prueba inmediatamente, 
así que responde directamente "...Wanna está generando tu historia..."
    
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
    });

  return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming text", error);
    return Response.json({ error: "Failed to stream text." }, { status: 500 });
  }
}

//[WANNA_REVIEW_READY]