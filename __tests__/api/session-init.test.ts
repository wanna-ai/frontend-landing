import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers cookies
const mockGet = vi.fn()
const mockSet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: mockGet,
    set: mockSet,
  })),
}))

// Mock fetch for backend call
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Mock crypto.randomUUID
vi.stubGlobal('crypto', {
  randomUUID: () => 'test-uuid-1234-5678-abcd',
})

import { POST } from '@/app/api/session/init/route'
import { NextRequest } from 'next/server'

function createRequest(body?: Record<string, unknown>): NextRequest {
  return new NextRequest('http://localhost:3000/api/session/init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
}

describe('POST /api/session/init', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue(new Response('{}', { status: 200 }))
  })

  it('returns existing sessionId if cookie already exists', async () => {
    mockGet.mockReturnValue({ value: 'existing-session-id' })

    const response = await POST(createRequest())
    const data = await response.json()

    expect(data.sessionId).toBe('existing-session-id')
    expect(mockFetch).not.toHaveBeenCalled()
    expect(mockSet).not.toHaveBeenCalled()
  })

  it('generates new sessionId when no cookie exists', async () => {
    mockGet.mockReturnValue(undefined)

    const response = await POST(createRequest())
    const data = await response.json()

    expect(data.sessionId).toBe('test-uuid-1234-5678-abcd')
  })

  it('calls backend with X-Wanna-Session-Id header', async () => {
    mockGet.mockReturnValue(undefined)

    await POST(createRequest({ language: 'es-ES' }))

    expect(mockFetch).toHaveBeenCalledTimes(1)
    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('/api/v1/session/init')
    expect(options.method).toBe('POST')
    expect(options.headers['X-Wanna-Session-Id']).toBe('test-uuid-1234-5678-abcd')
    expect(options.headers['Content-Type']).toBe('application/json')
  })

  it('forwards client context in body to backend', async () => {
    mockGet.mockReturnValue(undefined)
    const clientContext = { language: 'es-ES', screenWidth: 1920 }

    await POST(createRequest(clientContext))

    const [, options] = mockFetch.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual(clientContext)
  })

  it('sets cookie with correct options on new session', async () => {
    mockGet.mockReturnValue(undefined)

    const response = await POST(createRequest())

    // NextResponse.cookies.set is called internally, check the Set-Cookie header
    const setCookie = response.headers.get('set-cookie')
    expect(setCookie).toContain('WANNA_SESSION_ID=test-uuid-1234-5678-abcd')
    expect(setCookie).toContain('Max-Age=1800')
    expect(setCookie).toContain('Path=/')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie?.toLowerCase()).toContain('samesite=lax')
  })

  it('handles backend failure gracefully', async () => {
    mockGet.mockReturnValue(undefined)
    mockFetch.mockRejectedValue(new Error('Backend down'))

    const response = await POST(createRequest())

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Failed to initialize session')
  })

  it('forwards X-Forwarded-For header from client to backend', async () => {
    mockGet.mockReturnValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/session/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-forwarded-for': '203.0.113.50, 70.41.3.18',
      },
      body: JSON.stringify({}),
    })

    await POST(request)

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['X-Forwarded-For']).toBe('203.0.113.50')
  })

  it('forwards X-Real-Ip when X-Forwarded-For is absent', async () => {
    mockGet.mockReturnValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/session/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-real-ip': '198.51.100.23',
      },
      body: JSON.stringify({}),
    })

    await POST(request)

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['X-Forwarded-For']).toBe('198.51.100.23')
  })

  it('does not send X-Forwarded-For when no client IP headers present', async () => {
    mockGet.mockReturnValue(undefined)

    await POST(createRequest({ language: 'es-ES' }))

    const [, options] = mockFetch.mock.calls[0]
    expect(options.headers['X-Forwarded-For']).toBeUndefined()
  })

  it('handles request with no body', async () => {
    mockGet.mockReturnValue(undefined)

    const request = new NextRequest('http://localhost:3000/api/session/init', {
      method: 'POST',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(data.sessionId).toBe('test-uuid-1234-5678-abcd')
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
