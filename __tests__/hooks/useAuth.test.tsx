import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import { useAuth } from '@/app/hook/useAuth'
import React from 'react'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const defaultContext = {
  experienceData: null,
  setExperienceData: vi.fn(),
  promptData: null,
  setPromptData: vi.fn(),
  token: null,
  setToken: vi.fn(),
  postId: null,
  setPostId: vi.fn(),
  isLoadingPrompts: false,
  fetchPromptData: vi.fn(),
  userInfo: null,
  setUserInfo: vi.fn(),
  toast: { show: false, message: '', type: 'success' as const },
  setToast: vi.fn(),
  colorInverse: false,
  setColorInverse: vi.fn(),
  sessionId: null,
  setSessionId: vi.fn(),
}

function createWrapper(overrides = {}) {
  const value = { ...defaultContext, ...overrides }
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  )
}

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls /api/auth/check-auth with credentials:include', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ isAuthenticated: false, isGuest: true, user: null, token: null }),
    })

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
    await result.current.checkAuthStatus()

    expect(mockFetch).toHaveBeenCalledWith('/api/auth/check-auth', expect.objectContaining({
      credentials: 'include',
    }))
  })

  it('sets token and userInfo in context if authenticated', async () => {
    const user = { id: '1', fullName: 'Test User', pictureUrl: '/pic.jpg', username: 'testuser' }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ isAuthenticated: true, isGuest: false, user, token: 'abc123' }),
    })

    const setToken = vi.fn()
    const setUserInfo = vi.fn()
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper({ setToken, setUserInfo }),
    })

    await result.current.checkAuthStatus()

    expect(setToken).toHaveBeenCalledWith('abc123')
    expect(setUserInfo).toHaveBeenCalledWith(user)
  })

  it('clears context if not authenticated', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ isAuthenticated: false, isGuest: true, user: null, token: null }),
    })

    const setToken = vi.fn()
    const setUserInfo = vi.fn()
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper({ setToken, setUserInfo }),
    })

    await result.current.checkAuthStatus()

    expect(setToken).toHaveBeenCalledWith(null)
    expect(setUserInfo).toHaveBeenCalledWith(null)
  })

  it('returns null and clears context on error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    const setToken = vi.fn()
    const setUserInfo = vi.fn()
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper({ setToken, setUserInfo }),
    })

    const authStatus = await result.current.checkAuthStatus()

    expect(authStatus).toBeNull()
    expect(setToken).toHaveBeenCalledWith(null)
    expect(setUserInfo).toHaveBeenCalledWith(null)
  })

  it('returns AuthStatus on success', async () => {
    const expected = { isAuthenticated: true, isGuest: false, user: { id: '1', fullName: 'A', pictureUrl: '', username: 'a' }, token: 'tok' }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => expected,
    })

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })
    const authStatus = await result.current.checkAuthStatus()

    expect(authStatus).toEqual(expected)
  })
})
