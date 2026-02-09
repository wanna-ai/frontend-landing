import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const { interviewerPrompt, editorPrompt, forceSummary } = data || {};

    // 1. EXTRACCIÓN DE CONTENIDO
    const lastMessage = messages[messages.length - 1];
    let lastContent = "";

    if (typeof lastMessage?.content === 'string') {
      lastContent = lastMessage.content;
    } else if (Array.isArray(lastMessage?.parts)) {
      const textPart = lastMessage.parts.find((p: any) => p.type === 'text');
      lastContent = textPart?.text || "";
    }

    const cleanContent = lastContent.trim().toLowerCase();

    // 2. LÓGICA DE FASE (BETLEM o señal del Front)
    const isBetlem = cleanContent.includes("betlem");
    const isSummaryPhase = isBetlem || forceSummary === true;

    // 3. SELECCIÓN DE MODELO (Serie 4 - 2025/2026)
    const modelName = isSummaryPhase
        ? "claude-haiku-4-5-20251001"
        : "claude-sonnet-4-5-20250929";

    // Reconstruimos el prompt original para que la IA tenga contexto
    const fullPrompt = `${interviewerPrompt}\n\n${editorPrompt}\n\n Si escribo "BETLEM" crea una experiencia de prueba y ejecuta la tool reviewExperience`;

    // --- LOGGER ---
    console.log(`\n==== [WANNA DEBUG] ====`);
    console.log(`> Texto: "${cleanContent}"`);
    console.log(`> Modelo: ${modelName}`);
    console.log(`> Fase: ${isSummaryPhase ? 'RESUMEN' : 'ENTREVISTA'}`);
    console.log(`========================\n`);

    const result = streamText({
      model: anthropic(modelName),
      // Forzamos la tool solo en bypass o resumen
      toolChoice: isSummaryPhase ? 'required' : 'auto',
      messages: [
        {
          role: 'system',
          content: fullPrompt.trim()
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
          execute: async (params) => {
            console.log(`[TOOL] -> Ejecutada por ${modelName}`);
            return params;
          },
        },
      },
      temperature: isSummaryPhase ? 0.3 : 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[WANNA ERROR]:", error);
    return Response.json({ error: "Failed to process chat" }, { status: 500 });
  }
}