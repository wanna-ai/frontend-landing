import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
let mockSearchParamsMap = new Map<string, string>()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: (key: string) => mockSearchParamsMap.get(key) ?? null,
  }),
}))

// Mock useAuth
const mockCheckAuthStatus = vi.fn()
vi.mock('@/app/hook/useAuth', () => ({
  useAuth: () => ({ checkAuthStatus: mockCheckAuthStatus }),
}))

// Mock apiService
vi.mock('@/services/api', () => ({
  apiService: { post: vi.fn(), get: vi.fn() },
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import LoginSuccessPage from '@/app/login/success/page'

const defaultContext = {
  experienceData: null,
  setExperienceData: vi.fn(),
  promptData: null,
  setPromptData: vi.fn(),
  token: null,
  setToken: vi.fn(),
  postId: 'ctx-post-id',
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

function renderPage(contextOverrides = {}) {
  const value = { ...defaultContext, ...contextOverrides }
  return render(
    <AppContext.Provider value={value}>
      <LoginSuccessPage />
    </AppContext.Provider>
  )
}

describe('LoginSuccessPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParamsMap = new Map()
    localStorage.clear()
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ lastpage: 'story' }),
    })
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false, user: { id: '1' }, token: 'tok',
    })
  })

  it('redirects to / without token in params', async () => {
    renderPage()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('saves token in cookie via /api/auth/set-cookie', async () => {
    mockSearchParamsMap.set('token', 'my-new-token')

    renderPage()

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/set-cookie', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('my-new-token'),
      }))
    })
  })

  it('redirects to /result when lastpage is register', async () => {
    mockSearchParamsMap.set('token', 'tok')
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // set-cookie
      .mockResolvedValueOnce({ ok: true, json: async () => ({ lastpage: 'register' }) }) // get-cookie-lastpage

    renderPage()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/result')
    })
  })

  it('redirects to /story/{postId} when lastpage is not register', async () => {
    mockSearchParamsMap.set('token', 'tok')
    localStorage.setItem('postId', 'stored-post-id')
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // set-cookie
      .mockResolvedValueOnce({ ok: true, json: async () => ({ lastpage: 'story' }) }) // get-cookie-lastpage

    renderPage()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/story/stored-post-id')
    })
  })

  it('calls checkAuthStatus after saving cookie', async () => {
    mockSearchParamsMap.set('token', 'tok')

    renderPage()

    await waitFor(() => {
      expect(mockCheckAuthStatus).toHaveBeenCalled()
    })
  })
})
