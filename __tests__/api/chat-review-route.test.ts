import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @ai-sdk/anthropic
vi.mock('@ai-sdk/anthropic', () => ({
  anthropic: vi.fn((model: string) => ({ modelId: model })),
}))

// Mock ai module
const mockStreamObject = vi.fn()
vi.mock('ai', () => ({
  streamObject: (...args: unknown[]) => mockStreamObject(...args),
}))

import { POST } from '@/app/api/chat/review/route'

function createRequest(body: Record<string, unknown>) {
  return new Request('http://localhost:3000/api/chat/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/chat/review', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStreamObject.mockResolvedValue({
      toTextStreamResponse: () => new Response('stream'),
    })
  })

  it('returns 400 without conversation', async () => {
    const response = await POST(createRequest({ editorPrompt: 'prompt' }))
    expect(response.status).toBe(400)
  })

  it('returns 400 without editorPrompt', async () => {
    const response = await POST(createRequest({ conversation: 'convo' }))
    expect(response.status).toBe(400)
  })

  it('calls streamObject with schema and conversation in prompt', async () => {
    const request = createRequest({
      conversation: 'user: hello\nassistant: hi',
      editorPrompt: 'Genera una experiencia',
    })

    await POST(request)

    expect(mockStreamObject).toHaveBeenCalledTimes(1)
    const args = mockStreamObject.mock.calls[0][0]
    expect(args.schema).toBeDefined()
    expect(args.prompt).toContain('user: hello')
    expect(args.prompt).toContain('Genera una experiencia')
  })

  it('returns 500 on streaming error', async () => {
    mockStreamObject.mockImplementation(() => {
      throw new Error('Stream error')
    })

    const request = createRequest({
      conversation: 'test',
      editorPrompt: 'test',
    })

    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})
