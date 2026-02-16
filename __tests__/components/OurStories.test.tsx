import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import OurStories from '@/components/OurStories/OurStories'

describe('OurStories', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders names of all team members', () => {
    render(<OurStories />)

    expect(screen.getByText('Agus')).toBeInTheDocument()
    expect(screen.getByText('Adrià')).toBeInTheDocument()
    expect(screen.getByText('Marta')).toBeInTheDocument()
    expect(screen.getByText('Miguel')).toBeInTheDocument()
    expect(screen.getByText('Jordi')).toBeInTheDocument()
    expect(screen.getByText('Pau')).toBeInTheDocument()
  })

  it('story text is truncated by default', () => {
    render(<OurStories />)

    // The truncated text should end with "..."
    const storyTexts = screen.getAllByText(/\.\.\.$/i)
    expect(storyTexts.length).toBeGreaterThan(0)
  })

  it('click opens modal with full story', () => {
    render(<OurStories />)

    // Click on the first member name (which is inside the clickable item)
    const firstItem = screen.getByText('Agus').closest('[class*="item"]')!
    fireEvent.click(firstItem)

    // Modal should show close button
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()
  })

  it('closes modal with Escape', () => {
    render(<OurStories />)

    const firstItem = screen.getByText('Agus').closest('[class*="item"]')!
    fireEvent.click(firstItem)

    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })

    // After Escape, modal close triggers animation timeout
    vi.useFakeTimers()
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
  })

  it('closes modal on overlay click', () => {
    vi.useFakeTimers()

    render(<OurStories />)

    const firstItem = screen.getByText('Agus').closest('[class*="item"]')!
    fireEvent.click(firstItem)

    expect(screen.getByLabelText('Close modal')).toBeInTheDocument()

    // Click on the modal root element (which acts as overlay)
    const modalRoot = screen.getByLabelText('Close modal').closest('[class*="modal"]')!
    fireEvent.click(modalRoot)

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument()
  })

  it('snapshot: grid layout', () => {
    const { container } = render(<OurStories />)
    expect(container).toMatchSnapshot()
  })
})
