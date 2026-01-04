import { createHash } from 'node:crypto'

export type DatabaseProvider = 'postgresql' | 'mysql' | 'sqlite'

export type OtpType = 'sign-in' | 'email-verification' | 'forget-password'

export function inferProviderFromDatabaseUrl(url?: string): DatabaseProvider {
  const value = url ?? ''
  if (value.startsWith('file:')) return 'sqlite'
  if (value.startsWith('mysql')) return 'mysql'
  return 'postgresql'
}

export function otpSubject(type: OtpType) {
  switch (type) {
    case 'sign-in':
      return 'Your sign-in code'
    case 'email-verification':
      return 'Verify your email'
    case 'forget-password':
      return 'Reset your password'
  }
}

export function hashOtp(otp: string, secret = '') {
  return createHash('sha256').update(`${secret}:${otp}`).digest('hex')
}
