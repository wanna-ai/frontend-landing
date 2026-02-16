import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import React from 'react'

// Auto-cleanup after each test
afterEach(() => {
  cleanup()
})

// Global mock for next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { fill, priority, ...rest } = props
    return React.createElement('img', rest)
  },
}))

// Global mock for lottie-react
vi.mock('lottie-react', () => ({
  default: () => React.createElement('div', { 'data-testid': 'lottie-animation' }),
}))

// Global mock for next/link
vi.mock('next/link', () => ({
  default: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', props, children),
}))
