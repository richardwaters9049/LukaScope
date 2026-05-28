import { isDemoUser, getDisplayNameFromEmail, DEMO_CREDENTIALS, SESSION_COOKIE_NAME } from '../lib/auth'

describe('auth utilities', () => {
  describe('isDemoUser', () => {
    it('returns true for valid demo credentials', () => {
      expect(isDemoUser(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)).toBe(true)
    })

    it('returns false for incorrect email', () => {
      expect(isDemoUser('wrong@example.com', DEMO_CREDENTIALS.password)).toBe(false)
    })

    it('returns false for incorrect password', () => {
      expect(isDemoUser(DEMO_CREDENTIALS.email, 'wrong')).toBe(false)
    })

    it('returns false for empty strings', () => {
      expect(isDemoUser('', '')).toBe(false)
    })
  })

  describe('getDisplayNameFromEmail', () => {
    it('extracts and capitalises the first part of an email', () => {
      expect(getDisplayNameFromEmail('alice@example.com')).toBe('Alice')
    })

    it('splits on dots, hyphens, and underscores', () => {
      expect(getDisplayNameFromEmail('john.doe@example.com')).toBe('John')
      expect(getDisplayNameFromEmail('jane-doe@example.com')).toBe('Jane')
      expect(getDisplayNameFromEmail('bob_smith@example.com')).toBe('Bob')
    })

    it('returns "User" for empty or invalid input', () => {
      expect(getDisplayNameFromEmail('')).toBe('User')
    })
  })

  describe('SESSION_COOKIE_NAME', () => {
    it('is a non-empty string', () => {
      expect(typeof SESSION_COOKIE_NAME).toBe('string')
      expect(SESSION_COOKIE_NAME.length).toBeGreaterThan(0)
    })
  })
})
