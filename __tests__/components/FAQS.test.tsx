import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FAQS from '@/components/FAQS/FAQS'

describe('FAQS', () => {
  it('renders all FAQ questions', () => {
    render(<FAQS />)

    expect(screen.getByText('¿Qué es Wanna?')).toBeInTheDocument()
    expect(screen.getByText('¿Qué se supone que tengo que explicar?')).toBeInTheDocument()
    expect(screen.getByText('¿Dónde irá a parar mi conversación?')).toBeInTheDocument()
  })

  it('all answers closed by default', () => {
    render(<FAQS />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('click reveals answer', () => {
    render(<FAQS />)

    const firstButton = screen.getByText('¿Qué es Wanna?').closest('button')!
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(firstButton)

    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('click again hides answer', () => {
    render(<FAQS />)

    const firstButton = screen.getByText('¿Qué es Wanna?').closest('button')!
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('only one FAQ open at a time', () => {
    render(<FAQS />)

    const firstButton = screen.getByText('¿Qué es Wanna?').closest('button')!
    const secondButton = screen.getByText('¿Qué se supone que tengo que explicar?').closest('button')!

    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(secondButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    expect(secondButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('snapshot: initial state (all closed)', () => {
    const { container } = render(<FAQS />)
    expect(container).toMatchSnapshot()
  })
})
