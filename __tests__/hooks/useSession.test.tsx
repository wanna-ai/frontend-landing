import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import { useSession } from '@/app/hook/useSession'
import React from 'react'

// Mock fetch
const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

// Default context values
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

function createWrapper(contextOverrides = {}) {
  const contextValue = { ...defaultContext, ...contextOverrides }
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

describe('useSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ sessionId: 'new-session-123' }),
    })
  })

  it('calls /api/session/init on mount', async () => {
    renderHook(() => useSession(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toBe('/api/session/init')
    expect(options.method).toBe('POST')
    expect(options.credentials).toBe('include')
  })

  it('sends client context in request body', async () => {
    renderHook(() => useSession(), { wrapper: createWrapper() })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    const [, options] = mockFetch.mock.calls[0]
    const body = JSON.parse(options.body)
    expect(body).toHaveProperty('language')
    expect(body).toHaveProperty('userAgent')
    expect(body).toHaveProperty('screenWidth')
    expect(body).toHaveProperty('screenHeight')
    expect(body).toHaveProperty('timezone')
  })

  it('sets sessionId in context on success', async () => {
    const setSessionId = vi.fn()
    renderHook(() => useSession(), {
      wrapper: createWrapper({ setSessionId }),
    })

    await waitFor(() => {
      expect(setSessionId).toHaveBeenCalledWith('new-session-123')
    })
  })

  it('does not call setSessionId on fetch failure', async () => {
    mockFetch.mockResolvedValue({ ok: false })
    const setSessionId = vi.fn()

    renderHook(() => useSession(), {
      wrapper: createWrapper({ setSessionId }),
    })

    // Wait a tick for the async effect to settle
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    expect(setSessionId).not.toHaveBeenCalled()
  })

  it('only calls init once even on re-render', async () => {
    const { rerender } = renderHook(() => useSession(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    rerender()
    rerender()

    // Still only 1 call thanks to the ref guard
    expect(mockFetch).toHaveBeenCalledTimes(1)
  })
})
