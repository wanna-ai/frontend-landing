import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
let mockPostIdParam: string | null = 'test-post-id'
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({
    get: (key: string) => key === 'postId' ? mockPostIdParam : null,
  }),
}))

// Mock useAuth
const mockCheckAuthStatus = vi.fn()
vi.mock('@/app/hook/useAuth', () => ({
  useAuth: () => ({ checkAuthStatus: mockCheckAuthStatus }),
}))

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}))
vi.mock('remark-gfm', () => ({ default: () => {} }))
vi.mock('rehype-raw', () => ({ default: () => {} }))

// Mock apiService
const mockApiGet = vi.fn()
const mockApiPut = vi.fn()
vi.mock('@/services/api', () => ({
  apiService: {
    get: (...args: unknown[]) => mockApiGet(...args),
    put: (...args: unknown[]) => mockApiPut(...args),
  },
}))

import VisibilityPage from '@/app/visibility/page'

const defaultContext = {
  experienceData: null as any,
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
      <VisibilityPage />
    </AppContext.Provider>
  )
}

const postData = {
  title: 'My Story', experience: 'exp', pildoras: [], reflection: 'ref',
  story_valuable: 'valuable content', rawInterviewText: 'raw', visibility: 'PRIVATE',
}

describe('VisibilityPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPostIdParam = 'test-post-id'
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false, token: 'tok', user: { id: '1' },
    })
    mockApiGet.mockResolvedValue(postData)
    mockApiPut.mockResolvedValue({})
  })

  it('redirects to / without postId', () => {
    mockPostIdParam = null
    renderPage()
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('fetches post data on mount', async () => {
    renderPage()

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalledWith(
        '/api/v1/landing/posts/test-post-id',
        expect.any(Object)
      )
    })
  })

  it('private visibility selected by default', async () => {
    renderPage()

    // Wait for component to render after async operations
    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled()
    })

    const privateRadio = screen.getByDisplayValue('private') as HTMLInputElement
    expect(privateRadio.checked).toBe(true)
  })

  it('allows changing to public', async () => {
    renderPage()

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled()
    })

    const publicRadio = screen.getByDisplayValue('public') as HTMLInputElement
    fireEvent.click(publicRadio)
    expect(publicRadio.checked).toBe(true)
  })

  it('PUT with correct visibility on publish', async () => {
    renderPage()

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled()
    })

    fireEvent.click(screen.getByText('Compartir mi historia'))

    await waitFor(() => {
      expect(mockApiPut).toHaveBeenCalledWith(
        '/api/v1/landing/posts/test-post-id/visibility',
        { visibility: 'private' },
        expect.any(Object)
      )
    })
  })

  it('navigates to /succeed?postId=X after success', async () => {
    renderPage()

    await waitFor(() => {
      expect(mockApiGet).toHaveBeenCalled()
    })

    fireEvent.click(screen.getByText('Compartir mi historia'))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/succeed?postId=test-post-id')
    })
  })

  it('shows story_valuable section when available', async () => {
    // Pre-set experienceData so component renders story_valuable section
    renderPage({
      experienceData: {
        title: 'T', experience: 'E', pildoras: [], reflection: 'R',
        story_valuable: 'This is valuable', rawInterviewText: 'raw', visibility: 'PRIVATE',
      },
    })

    await waitFor(() => {
      expect(screen.getByText('¿Por qué compartirla?')).toBeInTheDocument()
    })
  })

  it('redirects to / if fetch fails', async () => {
    mockApiGet.mockRejectedValue(new Error('Not found'))
    renderPage()

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/')
    })
  })
})
