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

// Mock apiService
const mockApiGet = vi.fn()
vi.mock('@/services/api', () => ({
  apiService: {
    get: (...args: unknown[]) => mockApiGet(...args),
  },
}))

// Mock CardStory
vi.mock('@/components/CardStory/CardStory', () => ({
  default: ({ user, title }: { user: { fullName: string }; title: string }) => (
    <div data-testid="card-story">{user.fullName} - {title}</div>
  ),
}))

// Mock html2canvas
vi.mock('html2canvas', () => ({
  default: vi.fn(),
}))

import SucceedPage from '@/app/succeed/page'

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
  userInfo: { id: '1', fullName: 'Test User', pictureUrl: '/pic.jpg', username: 'testuser' },
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
      <SucceedPage />
    </AppContext.Provider>
  )
}

const postData = {
  title: 'My Story', experience: 'Story content', pildoras: [],
  reflection: 'ref', story_valuable: 'val', rawInterviewText: 'raw',
  visibility: 'PRIVATE',
}

describe('SucceedPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPostIdParam = 'test-post-id'
    localStorage.clear()
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false, token: 'tok', user: { id: '1' },
    })
    mockApiGet.mockResolvedValue(postData)

    // Mock clipboard
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('redirects to / without postId in URL', () => {
    mockPostIdParam = null
    renderPage()
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('fetches and displays post data', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByTestId('card-story')).toBeInTheDocument()
    })
  })

  it('shows specific header for PRIVATE', async () => {
    // Pre-set experienceData since setExperienceData is mocked and doesn't update state
    renderPage({
      experienceData: { ...postData },
    })

    await waitFor(() => {
      expect(screen.getByTestId('card-story')).toBeInTheDocument()
    })

    expect(screen.getByText(/Déjate conocer más/)).toBeInTheDocument()
  })

  it('shows specific header for PUBLIC', async () => {
    mockApiGet.mockResolvedValue({ ...postData, visibility: 'PUBLIC' })

    renderPage({
      experienceData: { ...postData, visibility: 'PUBLIC' },
    })

    await waitFor(() => {
      expect(screen.getByTestId('card-story')).toBeInTheDocument()
    })

    expect(screen.getByText(/Comparte tu historia/)).toBeInTheDocument()
  })

  it('copies link to clipboard', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Copiar enlace')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Copiar enlace'))

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('/story/test-post-id')
    )
  })

  it('shows toast after copying', async () => {
    const setToast = vi.fn()
    renderPage({ setToast })

    await waitFor(() => {
      expect(screen.getByText('Copiar enlace')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Copiar enlace'))

    expect(setToast).toHaveBeenCalledWith(expect.objectContaining({
      show: true,
      message: 'Enlace copiado al portapapeles',
    }))
  })

  it('opens WhatsApp share in new tab', async () => {
    const mockOpen = vi.fn()
    vi.stubGlobal('open', mockOpen)

    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Whatsapp')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Whatsapp'))

    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank'
    )
  })

  it('navigates to /chat on "Volver a hablar" button', async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText('Volver a hablar con Wanna')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Volver a hablar con Wanna'))
    expect(mockPush).toHaveBeenCalledWith('/chat')
  })
})
