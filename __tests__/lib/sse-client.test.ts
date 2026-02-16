import { describe, it, expect, vi } from 'vitest';
import { parseSSEStream, type WannaEvent } from '@/lib/sse-client';

function createStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

const makeEvent = (overrides: Partial<WannaEvent> = {}): WannaEvent => ({
  state: 'ENTREVISTANDO',
  type: 'text_chunk',
  payload: { text: 'hello' },
  timestamp: 1000,
  ...overrides,
});

describe('parseSSEStream', () => {
  it('parses multiple valid SSE events', async () => {
    const events: WannaEvent[] = [];
    const e1 = makeEvent({ payload: { text: 'one' } });
    const e2 = makeEvent({ type: 'thinking_step', payload: { text: 'two' } });

    const stream = createStream([
      `data: ${JSON.stringify(e1)}\n`,
      `data: ${JSON.stringify(e2)}\n`,
    ]);

    await parseSSEStream(stream, (e) => events.push(e));

    expect(events).toHaveLength(2);
    expect(events[0].payload).toEqual({ text: 'one' });
    expect(events[1].type).toBe('thinking_step');
  });

  it('handles buffer split across chunks', async () => {
    const events: WannaEvent[] = [];
    const event = makeEvent();
    const json = JSON.stringify(event);
    const mid = Math.floor(json.length / 2);

    const stream = createStream([
      `data: ${json.slice(0, mid)}`,
      `${json.slice(mid)}\n`,
    ]);

    await parseSSEStream(stream, (e) => events.push(e));

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(event);
  });

  it('skips malformed JSON lines without throwing', async () => {
    const events: WannaEvent[] = [];
    const valid = makeEvent();

    const stream = createStream([
      `data: {not valid json}\n`,
      `data: ${JSON.stringify(valid)}\n`,
    ]);

    await parseSSEStream(stream, (e) => events.push(e));

    expect(events).toHaveLength(1);
    expect(events[0]).toEqual(valid);
  });

  it('respects AbortSignal and stops reading', async () => {
    const events: WannaEvent[] = [];
    const controller = new AbortController();
    controller.abort();

    const e1 = makeEvent();
    const stream = createStream([`data: ${JSON.stringify(e1)}\n`]);

    await parseSSEStream(stream, (e) => events.push(e), controller.signal);

    expect(events).toHaveLength(0);
  });

  it('ignores empty lines and lines without data: prefix', async () => {
    const events: WannaEvent[] = [];
    const valid = makeEvent();

    const stream = createStream([
      '\n',
      'event: message\n',
      `: comment line\n`,
      `data: ${JSON.stringify(valid)}\n`,
    ]);

    await parseSSEStream(stream, (e) => events.push(e));

    expect(events).toHaveLength(1);
  });

  it('parses all event types correctly', async () => {
    const events: WannaEvent[] = [];
    const types = ['text_chunk', 'thinking_step', 'ui_instruction'] as const;

    const chunks = types.map((type) =>
      `data: ${JSON.stringify(makeEvent({ type }))}\n`
    );

    const stream = createStream(chunks);
    await parseSSEStream(stream, (e) => events.push(e));

    expect(events.map((e) => e.type)).toEqual([
      'text_chunk',
      'thinking_step',
      'ui_instruction',
    ]);
  });

  it('ignores data: lines with empty payload', async () => {
    const events: WannaEvent[] = [];
    const valid = makeEvent();

    const stream = createStream([
      'data: \n',
      `data: ${JSON.stringify(valid)}\n`,
    ]);

    await parseSSEStream(stream, (e) => events.push(e));

    expect(events).toHaveLength(1);
  });
});
