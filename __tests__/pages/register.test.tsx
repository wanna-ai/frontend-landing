import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: () => null,
  }),
}))

// Mock useAuth
const mockCheckAuthStatus = vi.fn()
vi.mock('@/app/hook/useAuth', () => ({
  useAuth: () => ({ checkAuthStatus: mockCheckAuthStatus }),
}))

// Mock LoginProviders
vi.mock('@/components/LoginProviders/LoginProviders', () => ({
  default: ({ lastpage }: { lastpage: string }) => <div data-testid="login-providers">Login ({lastpage})</div>,
}))

// Mock apiService
vi.mock('@/services/api', () => ({
  apiService: { post: vi.fn(), get: vi.fn() },
}))

import RegisterPage from '@/app/register/page'

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

function renderPage(contextOverrides = {}) {
  const value = { ...defaultContext, ...contextOverrides }
  return render(
    <AppContext.Provider value={value}>
      <RegisterPage />
    </AppContext.Provider>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('redirects authenticated non-guest to /result with data in localStorage', async () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false, user: { username: 'realuser' }, token: 'tok',
    })

    renderPage()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/result')
    })
  })

  it('redirects authenticated non-guest to / without data in localStorage', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false, user: { username: 'realuser' }, token: 'tok',
    })

    renderPage()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })

  it('shows Google OAuth login by default for guest', async () => {
    // Guest user: checkAuth returns isGuest: true
    mockCheckAuthStatus.mockResolvedValue({ isAuthenticated: true, isGuest: true, user: null, token: null })

    renderPage()

    // Wait for async checkAuth to complete
    await waitFor(() => {
      expect(mockCheckAuthStatus).toHaveBeenCalled()
    })

    expect(screen.getByTestId('login-providers')).toBeInTheDocument()
  })

  it('shows registration title', async () => {
    mockCheckAuthStatus.mockResolvedValue({ isAuthenticated: true, isGuest: true, user: null, token: null })

    renderPage()

    await waitFor(() => {
      expect(mockCheckAuthStatus).toHaveBeenCalled()
    })

    expect(screen.getByText(/Regístrate y lee/)).toBeInTheDocument()
  })

  it('snapshot: default view', async () => {
    mockCheckAuthStatus.mockResolvedValue({ isAuthenticated: true, isGuest: true, user: null, token: null })

    const { container } = renderPage()

    await waitFor(() => {
      expect(mockCheckAuthStatus).toHaveBeenCalled()
    })

    expect(container).toMatchSnapshot()
  })
})
