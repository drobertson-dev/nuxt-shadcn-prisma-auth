import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { emailOTP } from 'better-auth/plugins'
import { Resend } from 'resend'
import { prisma } from './db'
import { hashOtp, inferProviderFromDatabaseUrl, otpSubject } from './auth-helpers'

const baseURL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
const socialProviders = {
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
    ? {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
      }
    : {}),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {}),
}

export const auth = betterAuth({
  baseURL,
  database: prismaAdapter(prisma, {
    provider: inferProviderFromDatabaseUrl(process.env.DATABASE_URL),
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders,
  experimental: { joins: true },
  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      sendVerificationOnSignUp: true,
      expiresIn: 300,
      allowedAttempts: 3,
      storeOTP: {
        hash: async (otp) => hashOtp(otp, process.env.BETTER_AUTH_SECRET ?? ''),
      },
      async sendVerificationOTP({ email, otp, type }) {
        const apiKey = process.env.RESEND_API_KEY
        const from = process.env.RESEND_FROM
        if (!apiKey || !from) {
          console.warn('Missing RESEND_API_KEY or RESEND_FROM; cannot send OTP email.')
          return
        }
        const resend = new Resend(apiKey)
        const subject = otpSubject(type)
        void resend.emails.send({
          from,
          to: email,
          subject,
          text: `Your code is: ${otp}\n\nThis code expires in 5 minutes.`,
        })
      },
    }),
  ],
})
