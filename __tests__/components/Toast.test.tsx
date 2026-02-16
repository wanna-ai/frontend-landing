import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Toast from '@/components/Toast/Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not render anything if visible has never been true', () => {
    const { container } = render(
      <Toast success visible={false} onClose={vi.fn()}>
        <p>Test message</p>
      </Toast>
    )

    expect(container.innerHTML).toBe('')
  })

  it('renders message when visible=true', () => {
    render(
      <Toast success visible onClose={vi.fn()}>
        <p>Success!</p>
      </Toast>
    )

    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('auto-closes after 3 seconds', () => {
    const onClose = vi.fn()
    render(
      <Toast success visible onClose={onClose}>
        <p>Auto close</p>
      </Toast>
    )

    expect(onClose).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('close button calls onClose', () => {
    const onClose = vi.fn()
    render(
      <Toast success visible onClose={onClose}>
        <p>Close me</p>
      </Toast>
    )

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
