import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useParams: () => ({ id: 'test-post-id' }),
}))

// Mock useAuth
const mockCheckAuthStatus = vi.fn()
vi.mock('@/app/hook/useAuth', () => ({
  useAuth: () => ({ checkAuthStatus: mockCheckAuthStatus }),
}))

// Mock apiService
const mockApiGet = vi.fn()
const mockApiPost = vi.fn()
vi.mock('@/services/api', () => ({
  apiService: {
    get: (...args: unknown[]) => mockApiGet(...args),
    post: (...args: unknown[]) => mockApiPost(...args),
  },
}))

// Mock react-markdown
vi.mock('react-markdown', () => ({
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}))
vi.mock('remark-gfm', () => ({ default: () => {} }))
vi.mock('rehype-raw', () => ({ default: () => {} }))

// Mock LoginProviders
vi.mock('@/components/LoginProviders/LoginProviders', () => ({
  default: ({ lastpage }: { lastpage: string }) => <div data-testid="login-providers">Login ({lastpage})</div>,
}))

// Mock CardStory
vi.mock('@/components/CardStory/CardStory', () => ({
  default: ({ user, title }: { user: { fullName: string }; title: string }) => (
    <div data-testid="card-story">{user.fullName} - {title}</div>
  ),
}))

// Mock Snippet
vi.mock('@/components/Snippet/Snippet', () => ({
  default: () => <div data-testid="snippet" />,
}))

import StoryPage from '@/app/story/[id]/page'

const defaultContext = {
  experienceData: null,
  setExperienceData: vi.fn(),
  promptData: null,
  setPromptData: vi.fn(),
  token: 'test-token',
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

function renderStory(contextOverrides = {}) {
  const value = { ...defaultContext, ...contextOverrides }
  return render(
    <AppContext.Provider value={value}>
      <StoryPage />
    </AppContext.Provider>
  )
}

const storyResponse = {
  title: 'My Story',
  content: 'Full story content',
  userName: 'testuser',
  isOwner: true,
  contributions: [],
  fullName: 'Test User',
  userPictureUrl: '/pic.jpg',
}

const previewResponse = {
  title: 'Preview Title',
  previewContent: 'Preview content...',
  userName: 'testuser',
  fullName: 'Test User',
  userPictureUrl: '/pic.jpg',
}

describe('StoryPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('login view: shows preview card + login prompt when guest', async () => {
    mockCheckAuthStatus.mockResolvedValue({ isAuthenticated: false, isGuest: true, user: null, token: null })
    mockApiGet.mockResolvedValue(previewResponse)

    renderStory()

    await waitFor(() => {
      expect(screen.getByTestId('login-providers')).toBeInTheDocument()
    })
    expect(screen.getByText(/desea compartir contigo una historia personal/)).toBeInTheDocument()
  })

  it('is-owner view: shows story card + contributions', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '1', fullName: 'Test User', pictureUrl: '/pic.jpg', username: 'testuser' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue({
      ...storyResponse,
      contributions: [{
        attribution: { fullName: 'Reader', pictureUrl: '/reader.jpg' },
        comments: [{ id: 'c1', content: 'Great story!', postId: 'p1', userId: 'u2', username: 'reader' }],
      }],
    })

    renderStory()

    await waitFor(() => {
      expect(screen.getByText('Great story!')).toBeInTheDocument()
    })
  })

  it('shows "no readers yet" with empty contributions', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '1', fullName: 'Test User', pictureUrl: '', username: 'testuser' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue(storyResponse)

    renderStory()

    await waitFor(() => {
      expect(screen.getByText(/no hay personas que hayan leído/i)).toBeInTheDocument()
    })
  })

  it('not-owner view: shows full story + comment textarea', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '2', fullName: 'Other User', pictureUrl: '', username: 'other' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue({ ...storyResponse, isOwner: false })

    renderStory()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe tu comentario...')).toBeInTheDocument()
    })
  })

  it('limits comment to 160 characters', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '2', fullName: 'Other', pictureUrl: '', username: 'other' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue({ ...storyResponse, isOwner: false })

    renderStory()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe tu comentario...')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Escribe tu comentario...')
    expect(textarea).toHaveAttribute('maxLength', '160')
  })

  it('shows character counter', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '2', fullName: 'Other', pictureUrl: '', username: 'other' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue({ ...storyResponse, isOwner: false })

    renderStory()

    await waitFor(() => {
      expect(screen.getByText('0/160')).toBeInTheDocument()
    })
  })

  it('sends comment via apiService.post', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '2', fullName: 'Other', pictureUrl: '', username: 'other' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue({ ...storyResponse, isOwner: false })
    mockApiPost.mockResolvedValue({})

    renderStory()

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe tu comentario...')).toBeInTheDocument()
    })

    const textarea = screen.getByPlaceholderText('Escribe tu comentario...')
    fireEvent.change(textarea, { target: { value: 'Nice story!' } })
    fireEvent.click(screen.getByText('Enviar comentario'))

    await waitFor(() => {
      expect(mockApiPost).toHaveBeenCalledWith(
        '/api/v1/posts/comments',
        expect.objectContaining({ content: 'Nice story!' }),
        expect.any(Object)
      )
    })
  })

  it('shows toast after successful comment', async () => {
    const setToast = vi.fn()
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '2', fullName: 'Other', pictureUrl: '', username: 'other' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue({ ...storyResponse, isOwner: false })
    mockApiPost.mockResolvedValue({})

    renderStory({ setToast })

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Escribe tu comentario...')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByPlaceholderText('Escribe tu comentario...'), { target: { value: 'Great!' } })
    fireEvent.click(screen.getByText('Enviar comentario'))

    await waitFor(() => {
      expect(setToast).toHaveBeenCalledWith(expect.objectContaining({
        show: true,
        type: 'success',
      }))
    })
  })

  it('opens modal on card click (owner)', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '1', fullName: 'Test User', pictureUrl: '', username: 'testuser' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue(storyResponse)

    renderStory()

    await waitFor(() => {
      expect(screen.getByTestId('card-story')).toBeInTheDocument()
    })

    // The card is wrapped in a div with onClick
    const cardWrapper = screen.getByTestId('card-story').closest('div[class]')
    // Find the parent that has the onClick handler (the one with class="...card")
    const clickable = screen.getByTestId('card-story').parentElement!
    fireEvent.click(clickable)

    await waitFor(() => {
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })
  })

  it('closes modal with Escape', async () => {
    mockCheckAuthStatus.mockResolvedValue({
      isAuthenticated: true, isGuest: false,
      user: { id: '1', fullName: 'Test User', pictureUrl: '', username: 'testuser' },
      token: 'tok',
    })
    mockApiGet.mockResolvedValue(storyResponse)

    renderStory()

    await waitFor(() => {
      expect(screen.getByTestId('card-story')).toBeInTheDocument()
    })

    const clickable = screen.getByTestId('card-story').parentElement!
    fireEvent.click(clickable)

    await waitFor(() => {
      expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
    })

    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
    })
  })

  it('snapshot: login view', async () => {
    mockCheckAuthStatus.mockResolvedValue({ isAuthenticated: false, isGuest: true, user: null, token: null })
    mockApiGet.mockResolvedValue(previewResponse)

    const { container } = renderStory()

    await waitFor(() => {
      expect(screen.getByTestId('login-providers')).toBeInTheDocument()
    })

    expect(container).toMatchSnapshot()
  })
})
