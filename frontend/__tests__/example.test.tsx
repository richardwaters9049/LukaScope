import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('framer-motion', () => {
  const forwardRef = React.forwardRef
  return {
    motion: new Proxy({}, {
      get: (_target: unknown, prop: string) => {
        const Component = forwardRef(function MotionProxy(props: Record<string, unknown>, ref: React.Ref<HTMLElement>) {
          return React.createElement(prop, { ...props, ref })
        })
        Component.displayName = `motion.${prop}`
        return Component
      },
    }),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

import Home from '../app/page'
import { DEMO_CREDENTIALS } from '../lib/auth'

describe('Home (login page)', () => {
  it('renders the LukaScope heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('LukaScope')
  })

  it('renders email and password inputs', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
  })

  it('renders the Log In button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
  })

  it('pre-fills the email and password fields for the demo login', () => {
    render(<Home />)
    const emailInput = screen.getByPlaceholderText('Email address') as HTMLInputElement
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement
    expect(emailInput.value).toBe(DEMO_CREDENTIALS.email)
    expect(passwordInput.value).toBe(DEMO_CREDENTIALS.password)
  })
})
