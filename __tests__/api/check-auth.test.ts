import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers cookies
const mockGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    get: mockGet,
  })),
}))

// Mock apiService
const mockApiGet = vi.fn()
vi.mock('@/services/api', () => ({
  apiService: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}))

import { GET } from '@/app/api/auth/check-auth/route'

describe('GET /api/auth/check-auth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthenticated without cookie authToken', async () => {
    mockGet.mockReturnValue(undefined)

    const response = await GET()
    const data = await response.json()

    expect(data.isAuthenticated).toBe(false)
    expect(data.user).toBeNull()
    expect(data.token).toBeNull()
  })

  it('returns authenticated with user data', async () => {
    mockGet.mockReturnValue({ value: 'valid-token' })
    const user = { id: '1', fullName: 'Test', pictureUrl: '/pic.jpg', username: 'testuser' }
    mockApiGet.mockResolvedValue(user)

    const response = await GET()
    const data = await response.json()

    expect(data.isAuthenticated).toBe(true)
    expect(data.user).toEqual(user)
    expect(data.token).toBe('valid-token')
  })

  it('identifies guest by prefix username', async () => {
    mockGet.mockReturnValue({ value: 'guest-token' })
    mockApiGet.mockResolvedValue({
      id: '2', fullName: 'Guest', pictureUrl: '', username: 'guest-abc123',
    })

    const response = await GET()
    const data = await response.json()

    expect(data.isGuest).toBe(true)
  })

  it('identifies real user as non-guest', async () => {
    mockGet.mockReturnValue({ value: 'real-token' })
    mockApiGet.mockResolvedValue({
      id: '3', fullName: 'Real User', pictureUrl: '', username: 'realuser',
    })

    const response = await GET()
    const data = await response.json()

    expect(data.isGuest).toBe(false)
  })

  it('returns unauthenticated if backend fails', async () => {
    mockGet.mockReturnValue({ value: 'token' })
    mockApiGet.mockRejectedValue(new Error('Backend error'))

    const response = await GET()
    const data = await response.json()

    expect(data.isAuthenticated).toBe(false)
    expect(data.user).toBeNull()
  })

  it('returns graceful response when cookies throws', async () => {
    // When cookies() throws, checkAuth catches it internally
    const { cookies } = await import('next/headers')
    vi.mocked(cookies).mockRejectedValueOnce(new Error('Unexpected'))

    const response = await GET()
    const data = await response.json()

    // checkAuth catches the error and returns unauthenticated
    expect(data.isAuthenticated).toBe(false)
    expect(data.user).toBeNull()
  })
})
