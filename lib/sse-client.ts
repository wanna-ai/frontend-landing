export type WannaEventState = 'ENTREVISTANDO' | 'GUARDANDO' | 'ANALIZANDO' | 'IDENTIFICANDO' | 'REDACTANDO' | 'PROCESANDO' | 'RESUMEN_READY';
export type WannaEventType = 'text_chunk' | 'thinking_step' | 'ui_instruction';

export interface WannaEvent {
  state: WannaEventState;
  type: WannaEventType;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface LockData {
  title: string;
  pills: string[];
  blurPreview: string;
}

export interface StoryStatus {
  status: 'GENERATING' | 'COMPLETED';
  postId?: string;
  title?: string;
  pills?: string;
  insight?: string;
  valuable?: string;
  blurPreview?: string;
}

export async function parseSSEStream(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: WannaEvent) => void,
  signal?: AbortSignal,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      if (signal?.aborted) break;

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;

        const jsonStr = trimmed.slice(5).trim();
        if (!jsonStr) continue;

        try {
          const event = JSON.parse(jsonStr) as WannaEvent;
          onEvent(event);
        } catch {
          // Skip malformed JSON lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
