import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import LoginProviders from '@/components/LoginProviders/LoginProviders'
import { renderWithContext } from '../helpers/test-utils'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

describe('LoginProviders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true })
  })

  it('renders Google button', () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    expect(screen.getByText('Continuar con Google')).toBeInTheDocument()
  })

  it('saves lastpage cookie before redirect', async () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    // The LoginOAuth component has onClick on the wrapping div
    const googleText = screen.getByText('Continuar con Google')
    const clickableDiv = googleText.closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/set-cookie', expect.objectContaining({
        method: 'POST',
      }))
    })

    // Verify the cookie payload includes lastpage
    const fetchCall = mockFetch.mock.calls.find(
      (call: [string, ...unknown[]]) => call[0] === '/api/auth/set-cookie'
    )
    expect(fetchCall).toBeDefined()
    const body = JSON.parse(fetchCall![1].body)
    expect(body.name).toBe('lastpage')
    expect(body.value).toBe('register')
  })

  it('redirects to backend OAuth endpoint', async () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining('/oauth2/authorization/google')
      )
    })
  })

  it('includes sessionId as query param when available', async () => {
    const testSessionId = 'test-session-uuid-123'
    renderWithContext(<LoginProviders lastpage="register" />, { sessionId: testSessionId })

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(`/oauth2/authorization/google?sessionId=${testSessionId}`)
      )
    })
  })

  it('omits sessionId query param when sessionId is null', async () => {
    renderWithContext(<LoginProviders lastpage="register" />, { sessionId: null })

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringMatching(/\/oauth2\/authorization\/google$/)
      )
    })
  })

  it('prevents double-click', async () => {
    renderWithContext(<LoginProviders lastpage="register" />)

    const clickableDiv = screen.getByText('Continuar con Google').closest('[class*="login"]')!
    fireEvent.click(clickableDiv)

    // Second click should be ignored due to isLoading state
    fireEvent.click(clickableDiv)

    await waitFor(() => {
      // setCookie should only be called once (for the first click)
      const setCookieCalls = mockFetch.mock.calls.filter(
        (call: [string, ...unknown[]]) => call[0] === '/api/auth/set-cookie'
      )
      expect(setCookieCalls.length).toBe(1)
    })
  })
})
