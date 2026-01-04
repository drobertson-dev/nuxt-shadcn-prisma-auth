import { describe, expect, it } from 'vitest'

import { hashOtp, inferProviderFromDatabaseUrl, otpSubject } from '../../server/utils/auth-helpers'

describe('auth helpers', () => {
  it('infers database provider from url', () => {
    expect(inferProviderFromDatabaseUrl('file:./dev.db')).toBe('sqlite')
    expect(inferProviderFromDatabaseUrl('mysql://user:pass@localhost:3306/db')).toBe('mysql')
    expect(inferProviderFromDatabaseUrl('postgresql://user:pass@localhost:5432/db')).toBe(
      'postgresql'
    )
    expect(inferProviderFromDatabaseUrl(undefined)).toBe('postgresql')
  })

  it('returns the correct otp subject', () => {
    expect(otpSubject('sign-in')).toBe('Your sign-in code')
    expect(otpSubject('email-verification')).toBe('Verify your email')
    expect(otpSubject('forget-password')).toBe('Reset your password')
  })

  it('hashes otps deterministically', () => {
    const first = hashOtp('123456', 'secret')
    const second = hashOtp('123456', 'secret')
    const different = hashOtp('123456', 'other')

    expect(first).toBe(second)
    expect(first).not.toBe(different)
  })
})
