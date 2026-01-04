import { describe, expect, it } from 'vitest'
import { $fetch, setup } from '@nuxt/test-utils/e2e'

describe('users api', async () => {
  await setup()

  it('returns a user list', async () => {
    const response = await $fetch('/api/users')

    expect(response.success).toBe(true)
    expect(Array.isArray(response.data.users)).toBe(true)
    expect(response.data.users.length).toBeGreaterThan(0)
  })
})
