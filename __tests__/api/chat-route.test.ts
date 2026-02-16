import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @ai-sdk/anthropic
vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn((model: string) => ({ modelId: model })),
}))

// Mock ai module
const mockStreamText = vi.fn()
vi.mock('ai', () => ({
  streamText: (...args: unknown[]) => mockStreamText(...args),
  convertToModelMessages: vi.fn(async (msgs: unknown) => msgs),
}))

import { POST } from '@/app/api/chat/route'

function createRequest(body: Record<string, unknown>) {
  return new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStreamText.mockReturnValue({
      toUIMessageStreamResponse: () => new Response('stream'),
    })
  })

  it('calls streamText with Anthropic model and system prompt with interviewerPrompt', async () => {
    const request = createRequest({
      messages: [{ role: 'user', content: 'Hola' }],
      data: { interviewerPrompt: 'Eres un entrevistador', editorPrompt: '' },
    })

    await POST(request)

    expect(mockStreamText).toHaveBeenCalledTimes(1)
    const args = mockStreamText.mock.calls[0][0]
    expect(args.model).toBeDefined()
    expect(args.messages[0].role).toBe('system')
    expect(args.messages[0].content).toContain('Eres un entrevistador')
  })

  it('system prompt contains trigger instruction', async () => {
    const request = createRequest({
      messages: [],
      data: { interviewerPrompt: 'test prompt', editorPrompt: '' },
    })

    await POST(request)

    const args = mockStreamText.mock.calls[0][0]
    expect(args.messages[0].content).toContain('Wanna está generando tu historia')
  })

  it('returns 500 on streaming error', async () => {
    mockStreamText.mockImplementation(() => {
      throw new Error('Stream error')
    })

    const request = createRequest({
      messages: [],
      data: { interviewerPrompt: 'test', editorPrompt: '' },
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})
