import { describe, expect, it } from 'vitest'

import { formatDisplayName } from '../../shared/utils/formatDisplayName'

describe('formatDisplayName', () => {
  it('formats a first and last name', () => {
    expect(formatDisplayName({ firstName: 'Ada', lastName: 'Lovelace' })).toBe('Ada Lovelace')
  })

  it('includes the nickname when provided', () => {
    expect(
      formatDisplayName({
        firstName: 'Grace',
        lastName: 'Hopper',
        nickname: 'Amazing Grace',
      })
    ).toBe('Grace Hopper (Amazing Grace)')
  })
})
