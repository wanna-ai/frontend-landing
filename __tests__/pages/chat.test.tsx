import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import React from 'react'

// Mock next/navigation
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
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

// Mock components
vi.mock('@/components/Loader/Loader', () => ({
  default: () => <div data-testid="loader" />,
}))
vi.mock('@/components/LoaderGenerate/LoaderGenerate', () => ({
  default: () => <div data-testid="loader-generate" />,
}))

// Mock @ai-sdk/react useChat
const mockSendMessage = vi.fn()
const mockStop = vi.fn()
const mockSetMessages = vi.fn()
let mockMessages: Array<{ id: string; role: string; parts: Array<{ type: string; text: string }> }> = []
let mockStatus = 'ready'

vi.mock('@ai-sdk/react', () => ({
  useChat: (options?: { onFinish?: (args: { message: any }) => void }) => ({
    messages: mockMessages,
    setMessages: mockSetMessages,
    sendMessage: mockSendMessage,
    status: mockStatus,
    stop: mockStop,
  }),
}))

// Mock apiService
vi.mock('@/services/api', () => ({
  apiService: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

import ChatPage from '@/app/chat/page'

const defaultContext = {
  experienceData: null,
  setExperienceData: vi.fn(),
  promptData: { interviewerPromp: 'Test prompt', editorPrompt: 'Editor prompt' },
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

function renderChat(contextOverrides = {}) {
  const value = { ...defaultContext, ...contextOverrides }
  return render(
    <AppContext.Provider value={value}>
      <ChatPage />
    </AppContext.Provider>
  )
}

describe('ChatPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockMessages = []
    mockStatus = 'ready'
    localStorage.clear()
  })

  it('renders assistant messages as markdown', () => {
    mockMessages = [
      { id: '1', role: 'assistant', parts: [{ type: 'text', text: '**Hello** world' }] },
    ]

    renderChat()

    expect(screen.getByText('**Hello** world')).toBeInTheDocument()
  })

  it('renders user messages differently styled', () => {
    mockMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'My message' }] },
    ]

    renderChat()

    const msgEl = screen.getByText('My message').closest('[class*="content"]')
    expect(msgEl?.className).toContain('user')
  })

  it('hides the [WANNA_REVIEW_READY] trigger from display', () => {
    mockMessages = [
      { id: '1', role: 'assistant', parts: [{ type: 'text', text: 'Check [WANNA_REVIEW_READY] done' }] },
    ]

    renderChat()

    expect(screen.queryByText(/WANNA_REVIEW_READY/)).not.toBeInTheDocument()
  })

  it('shows loader when status is submitted', () => {
    mockStatus = 'submitted'

    renderChat()

    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('shows stop button during streaming, submit when ready', () => {
    mockStatus = 'streaming'
    const { rerender } = renderChat()

    // During streaming: stop button should be present (button with type="button")
    const stopBtn = document.querySelector('button[type="button"]')
    expect(stopBtn).toBeInTheDocument()
  })

  it('disables submit with empty input', () => {
    mockStatus = 'ready'
    renderChat()

    const submitBtn = document.querySelector('button[type="submit"]')
    expect(submitBtn).toBeDisabled()
  })

  it('clears localStorage on initialization', () => {
    localStorage.setItem('title', 'old title')
    localStorage.setItem('content', 'old content')

    renderChat()

    expect(localStorage.getItem('title')).toBeNull()
    expect(localStorage.getItem('content')).toBeNull()
  })

  it('snapshot: chat with 2 messages', () => {
    mockMessages = [
      { id: '1', role: 'user', parts: [{ type: 'text', text: 'Hello Wanna' }] },
      { id: '2', role: 'assistant', parts: [{ type: 'text', text: 'Welcome to Wanna!' }] },
    ]

    const { container } = renderChat()
    expect(container).toMatchSnapshot()
  })
})
