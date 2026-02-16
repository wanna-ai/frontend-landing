'use client';

import { useState, useCallback, useRef } from 'react';
import { API_BASE_URL } from '@/services/config/api';
import { parseSSEStream } from '@/lib/sse-client';
import type { WannaEvent, LockData, StoryStatus } from '@/lib/sse-client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  retried?: boolean;
  failed?: boolean;
}

export type BackendChatStatus = 'ready' | 'streaming' | 'processing' | 'locked';

const STATE_PHRASES: Record<string, string> = {
  GUARDANDO: 'guardando contexto de la conversación...',
  ANALIZANDO: 'analizando el arco emocional...',
  IDENTIFICANDO: 'identificando los momentos clave...',
  REDACTANDO: 'redactando el borrador final...',
  PROCESANDO: 'redactando el borrador final...',
  RESUMEN_READY: 'resumen listo',
};

export interface UseBackendChatReturn {
  messages: ChatMessage[];
  status: BackendChatStatus;
  sendMessage: (text: string) => void;
  retryMessage: (messageId: string) => void;
  stop: () => void;
  statusLine: string | null;
  lockData: LockData | null;
  sessionId: string;
  storyPreview: StoryStatus | null;
  startPolling: () => void;
}

function getOrCreateSessionId(): string {
  const existing = localStorage.getItem('wanna_sessionId');
  if (existing) return existing;
  const newId = crypto.randomUUID();
  localStorage.setItem('wanna_sessionId', newId);
  return newId;
}

const POLL_INTERVAL_MS = 1500;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000];

export function useBackendChat(): UseBackendChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<BackendChatStatus>('ready');
  const [statusLine, setStatusLine] = useState<string | null>(null);
  const [lockData, setLockData] = useState<LockData | null>(null);
  const [storyPreview, setStoryPreview] = useState<StoryStatus | null>(null);
  const [sessionId] = useState(getOrCreateSessionId);
  const abortControllerRef = useRef<AbortController | null>(null);
  const messageCounterRef = useRef(0);
  const pollingRef = useRef(false);

  const stop = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setStatus('ready');
  }, []);

  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    pollingRef.current = true;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/chat/${sessionId}/status`);
        if (!res.ok) return;
        const data = await res.json() as StoryStatus;

        if (data.status === 'COMPLETED') {
          clearInterval(intervalId);
          pollingRef.current = false;
          setStatusLine(null);
          setStoryPreview(data);
        }
      } catch {
        // Silently retry on next interval
      }
    }, POLL_INTERVAL_MS);
  }, [sessionId]);

  const sendMessage = useCallback((text: string) => {
    const userMsgId = `msg-${++messageCounterRef.current}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setStatus('streaming');
    setStatusLine(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const assistantMsgId = `msg-${++messageCounterRef.current}`;
    let assistantContent = '';

    setMessages((prev) => [
      ...prev,
      { id: assistantMsgId, role: 'assistant', content: '' },
    ]);

    const url = `${API_BASE_URL}/api/v1/chat/stream?message=${encodeURIComponent(text)}&sessionId=${encodeURIComponent(sessionId)}`;

    const attemptSend = (attempt: number): void => {
      fetch(url, {
        method: 'POST',
        signal: abortController.signal,
      })
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          if (!response.body) throw new Error('No response body');

          let lastState = '';

          return parseSSEStream(
            response.body,
            (event: WannaEvent) => {
              if (event.state && event.state !== 'ENTREVISTANDO' && event.state !== lastState) {
                lastState = event.state;
                setStatusLine(STATE_PHRASES[event.state] || event.state);
              }

              if (event.type === 'text_chunk') {
                const chunk = (event.payload.content as string) || '';
                assistantContent += chunk;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantMsgId ? { ...m, content: assistantContent } : m,
                  ),
                );
              }

              if (event.payload?.action === 'SHOW_LOCK' || event.state === 'PROCESANDO' || event.state === 'REDACTANDO') {
                if (!lockData) {
                  const data: LockData = {
                    title: (event.payload.title as string) || '',
                    pills: (event.payload.pills as string[]) || [],
                    blurPreview: (event.payload.blurPreview as string) || '',
                  };
                  setLockData(data);
                  setStatus('locked');
                }
              }

              if (event.state === 'PROCESANDO' || event.state === 'REDACTANDO') {
                setStatus('processing');
              } else if (event.state === 'RESUMEN_READY') {
                setStatus('locked');
              }
            },
            abortController.signal,
          );
        })
        .then(() => {
          if (!abortController.signal.aborted) {
            if (attempt > 0) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === userMsgId ? { ...m, retried: true } : m,
                ),
              );
            }
            setStatus((current) => (current === 'locked' || current === 'processing' ? current : 'ready'));
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;

          if (attempt < MAX_RETRIES) {
            console.warn(`SSE stream error (attempt ${attempt + 1}/${MAX_RETRIES}), retrying...`, err);
            setStatusLine(`reintentando conexión (${attempt + 1}/${MAX_RETRIES})...`);
            setTimeout(() => attemptSend(attempt + 1), RETRY_DELAYS[attempt]);
          } else {
            console.error('SSE stream error: all retries exhausted', err);
            setMessages((prev) =>
              prev
                .filter((m) => !(m.id === assistantMsgId && m.content === ''))
                .map((m) =>
                  m.id === userMsgId ? { ...m, failed: true } : m,
                ),
            );
            setStatusLine(null);
            setStatus('ready');
          }
        });
    };

    attemptSend(0);
  }, [sessionId, lockData]);

  const retryMessage = useCallback((messageId: string) => {
    const msg = messages.find((m) => m.id === messageId);
    if (!msg || msg.role !== 'user' || !msg.failed) return;

    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    sendMessage(msg.content);
  }, [messages, sendMessage]);

  return {
    messages,
    status,
    sendMessage,
    retryMessage,
    stop,
    statusLine,
    lockData,
    sessionId,
    storyPreview,
    startPolling,
  };
}
