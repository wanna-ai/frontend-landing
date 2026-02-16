import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/auth/set-cookie/route'

function createRequest(body: Record<string, unknown>) {
  return new Request('http://localhost:3000/api/auth/set-cookie', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/auth/set-cookie', () => {
  it('sets HttpOnly cookie with name and value', async () => {
    const response = await POST(createRequest({ name: 'authToken', value: 'abc123' }))
    const data = await response.json()

    expect(data.success).toBe(true)
    const setCookie = response.headers.get('set-cookie')
    expect(setCookie).toContain('authToken=abc123')
    expect(setCookie).toContain('HttpOnly')
  })

  it('returns 400 if name is missing', async () => {
    const response = await POST(createRequest({ value: 'abc123' }))
    expect(response.status).toBe(400)
  })

  it('returns 400 if value is missing', async () => {
    const response = await POST(createRequest({ name: 'authToken' }))
    expect(response.status).toBe(400)
  })

  it('sets cookie with max-age 7 days', async () => {
    const response = await POST(createRequest({ name: 'test', value: 'val' }))
    const setCookie = response.headers.get('set-cookie')
    // 7 days = 604800 seconds
    expect(setCookie).toContain('Max-Age=604800')
  })
})
