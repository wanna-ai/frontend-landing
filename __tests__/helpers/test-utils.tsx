import React from 'react'
import { render } from '@testing-library/react'
import { AppContext } from '@/context/AppContext'
import { vi } from 'vitest'

export const defaultContextValues = {
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

export function renderWithContext(
  ui: React.ReactElement,
  contextOverrides: Partial<typeof defaultContextValues> = {}
) {
  const contextValue = { ...defaultContextValues, ...contextOverrides }
  return render(
    <AppContext.Provider value={contextValue}>
      {ui}
    </AppContext.Provider>
  )
}

export function createContextWrapper(contextOverrides: Partial<typeof defaultContextValues> = {}) {
  const contextValue = { ...defaultContextValues, ...contextOverrides }
  return ({ children }: { children: React.ReactNode }) => (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Mock next/navigation
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
}

export const mockSearchParams = new URLSearchParams()

export const mockPathname = '/'

export function setupNavigationMocks() {
  vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    useSearchParams: () => mockSearchParams,
    useParams: () => ({}),
    usePathname: () => mockPathname,
  }))
}
