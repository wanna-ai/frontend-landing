import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CardStory from '@/components/CardStory/CardStory'

describe('CardStory', () => {
  const defaultProps = {
    user: { pictureUrl: '/avatar.jpg', fullName: 'John Doe' },
    title: 'My Story Title',
  }

  it('shows user name and story title', () => {
    render(<CardStory {...defaultProps} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('My Story Title')).toBeInTheDocument()
  })

  it('renders avatar image', () => {
    render(<CardStory {...defaultProps} />)

    const img = screen.getByAltText('John Doe')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/avatar.jpg')
  })

  it('snapshot', () => {
    const { container } = render(<CardStory {...defaultProps} />)
    expect(container).toMatchSnapshot()
  })
})
