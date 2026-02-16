import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import LoginProviders from '@/components/LoginProviders/LoginProviders'
import { renderWithContext } from '../helpers/test-utils'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/app/hook/useAuth', () => ({
  useAuth: () => ({ checkAuthStatus: vi.fn().mockResolvedValue(null) }),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

const mockWindowOpen = vi.fn()
const originalWindowOpen = window.open

describe('LoginProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true })
    window.open = mockWindowOpen
    mockWindowOpen.mockReturnValue({}) // popup not blocked
  })

  afterEach(() => {
    window.open = originalWindowOpen
  })

  it('renders Google button', () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    expect(screen.getByText('Continuar con Google')).toBeInTheDocument()
  })

  it('saves lastpage cookie before opening popup', async () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    const googleText = screen.getByText('Continuar con Google')
    const clickableDiv = googleText.closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/set-cookie', expect.objectContaining({
        method: 'POST',
      }))
    })

    const fetchCall = mockFetch.mock.calls.find(
      (call: [string, ...unknown[]]) => call[0] === '/api/auth/set-cookie'
    )
    expect(fetchCall).toBeDefined()
    const body = JSON.parse(fetchCall![1].body)
    expect(body.name).toBe('lastpage')
    expect(body.value).toBe('register')
  })

  it('opens popup to backend OAuth endpoint', async () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('/oauth2/authorization/google'),
        'google-auth',
        'width=500,height=600,popup=true'
      )
    })
  })

  it('includes sessionId as query param when available', async () => {
    const testSessionId = 'test-session-uuid-123'
    renderWithContext(<LoginProviders lastpage="register" />, { sessionId: testSessionId })

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(`/oauth2/authorization/google?sessionId=${testSessionId}`),
        'google-auth',
        expect.any(String)
      )
    })
  })

  it('omits sessionId query param when sessionId is null', async () => {
    renderWithContext(<LoginProviders lastpage="register" />, { sessionId: null })

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringMatching(/\/oauth2\/authorization\/google$/),
        'google-auth',
        expect.any(String)
      )
    })
  })

  it('falls back to location.href when popup is blocked', async () => {
    mockWindowOpen.mockReturnValue(null)
    const originalHref = window.location.href
    Object.defineProperty(window, 'location', {
      value: { ...window.location, href: originalHref },
      writable: true,
      configurable: true,
    })

    renderWithContext(<LoginProviders lastpage="register" />)

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalled()
      expect(window.location.href).toContain('/oauth2/authorization/google')
    })
  })

  it('prevents double-click', async () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      const setCookieCalls = mockFetch.mock.calls.filter(
        (call: [string, ...unknown[]]) => call[0] === '/api/auth/set-cookie'
      )
      expect(setCookieCalls.length).toBe(1)
    })
  })

  it('navigates to /result on WANNA_AUTH_SUCCESS when lastpage is register', async () => {
    mockFetch.mockResolvedValue({ ok: true })
    renderWithContext(<LoginProviders lastpage="register" />)

    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'WANNA_AUTH_SUCCESS', token: 'test-token-123' },
    }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/result')
    })
  })

  it('navigates to /story/{postId} on WANNA_AUTH_SUCCESS when postId exists', async () => {
    mockFetch.mockResolvedValue({ ok: true })
    renderWithContext(<LoginProviders lastpage="story" />, { postId: 'abc-123' })

    window.dispatchEvent(new MessageEvent('message', {
      data: { type: 'WANNA_AUTH_SUCCESS', token: 'test-token-123' },
    }))

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/story/abc-123')
    })
  })
})
