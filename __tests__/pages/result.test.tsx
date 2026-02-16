import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
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

// Mock Loader
vi.mock('@/components/Loader/Loader', () => ({
  default: () => <div data-testid="loader" />,
}))

// Mock apiService
vi.mock('@/services/api', () => ({
  apiService: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

// Mock @ai-sdk/react useObject
const mockSubmit = vi.fn()
let mockObject: Record<string, string> | null = null
let mockIsLoading = false
let mockError: Error | null = null

vi.mock('@ai-sdk/react', () => ({
  experimental_useObject: () => ({
    object: mockObject,
    submit: mockSubmit,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}))

import ResultPage from '@/app/result/page'

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

function renderResult(contextOverrides = {}) {
  const value = { ...defaultContext, ...contextOverrides }
  return render(
    <AppContext.Provider value={value}>
      <ResultPage />
    </AppContext.Provider>
  )
}

describe('ResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockObject = null
    mockIsLoading = false
    mockError = null
    localStorage.clear()
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false, user: { id: '1', fullName: 'Test', pictureUrl: '', username: 'test' }, token: 'tok',
    })
  })

  it('redirects to / without conversation in localStorage', async () => {
    renderResult()

    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('redirects to /register if user is guest', async () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockCheckAuthStatus.mockResolvedValue({ isAuthenticated: true, isGuest: true, user: null, token: null })

    renderResult()

    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/register')
    })
  })

  it('shows loading message while analyzing', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockIsLoading = true

    renderResult()

    expect(screen.getByText('Analizando tu conversación...')).toBeInTheDocument()
  })

  it('shows title when object.title available', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockObject = { title: 'Mi Historia', experience: '', reflection: '', story_valuable: '' }

    renderResult()

    expect(screen.getByText('Mi Historia')).toBeInTheDocument()
  })

  it('shows experience as markdown', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockObject = { title: 'Title', experience: '**Bold story**', reflection: '', story_valuable: '' }

    renderResult()

    expect(screen.getByText('**Bold story**')).toBeInTheDocument()
  })

  it('shows reflection section', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockObject = { title: 'Title', experience: 'exp', reflection: 'Deep reflection', story_valuable: '' }

    renderResult()

    expect(screen.getByText('Deep reflection')).toBeInTheDocument()
  })

  it('shows error state with back button', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockError = new Error('Something went wrong')

    renderResult()

    expect(screen.getByText('Error al generar experiencia')).toBeInTheDocument()
    expect(screen.getByText('Volver al inicio')).toBeInTheDocument()
  })

  it('disables button while loading or without postId', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockIsLoading = true
    mockObject = { title: 'T', experience: 'E', reflection: 'R', story_valuable: '' }

    renderResult()

    const btn = screen.getByText('Decide quién ve tu historia').closest('button')
    expect(btn).toBeDisabled()
  })

  it('enables navigation when loading complete with postId', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockIsLoading = false
    mockObject = { title: 'T', experience: 'E', reflection: 'R', story_valuable: '' }

    renderResult({ postId: 'post-123' })

    const btn = screen.getByText('Decide quién ve tu historia').closest('button')
    expect(btn).toBeEnabled()
  })

  it('snapshot: complete object', () => {
    localStorage.setItem('conversation', 'hello')
    localStorage.setItem('editorPrompt', 'prompt')
    mockObject = {
      title: 'Test Title',
      experience: 'Test experience content',
      reflection: 'Test reflection content',
      story_valuable: 'Test value',
    }

    const { container } = renderResult({
      userInfo: { id: '1', fullName: 'Test User', pictureUrl: '/pic.jpg', username: 'test' },
    })
    expect(container).toMatchSnapshot()
  })
})
