import { isDemoUser } from '../lib/auth'

describe('login API validation logic', () => {
  it('accepts valid demo credentials', () => {
    expect(isDemoUser('admin@lukascope.com', 'password123')).toBe(true)
  })

  it('rejects wrong email', () => {
    expect(isDemoUser('bad@example.com', 'password123')).toBe(false)
  })

  it('rejects wrong password', () => {
    expect(isDemoUser('admin@lukascope.com', 'wrong')).toBe(false)
  })

  describe('input validation helpers', () => {
    function validateLoginBody(body: unknown): { valid: boolean; error?: string } {
      if (
        typeof body !== 'object' ||
        body === null ||
        typeof (body as Record<string, unknown>).email !== 'string' ||
        typeof (body as Record<string, unknown>).password !== 'string'
      ) {
        return { valid: false, error: 'Email and password are required' }
      }
      return { valid: true }
    }

    it('rejects null body', () => {
      expect(validateLoginBody(null)).toEqual({ valid: false, error: 'Email and password are required' })
    })

    it('rejects missing password', () => {
      expect(validateLoginBody({ email: 'test@example.com' })).toEqual({
        valid: false,
        error: 'Email and password are required',
      })
    })

    it('rejects non-string email', () => {
      expect(validateLoginBody({ email: 123, password: 'abc' })).toEqual({
        valid: false,
        error: 'Email and password are required',
      })
    })

    it('accepts valid body', () => {
      expect(validateLoginBody({ email: 'a@b.com', password: 'x' })).toEqual({ valid: true })
    })
  })
})
