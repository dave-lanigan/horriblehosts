import { describe, expect, test } from 'bun:test'
import { categories, platforms, validateReport } from '../shared/reports'
import { publicReport, publicReportColumns } from '../server/utils/database'

const valid = {
  title: 'The listing did not match our stay',
  location: 'Lisbon, Portugal',
  platform: 'Airbnb',
  category: 'Not as advertised',
  stayMonth: '2025-12',
  body: 'We booked a quiet apartment, but arrived to find construction in the same building. The host had not mentioned this before we booked.',
  consent: true,
}

describe('report validation', () => {
  test('accepts both platforms and each category', () => {
    for (const platform of platforms) {
      for (const category of categories) {
        expect(validateReport({ ...valid, platform, category }).platform).toBe(platform)
      }
    }
  })
  test('trims content and discards supplied author information', () => {
    const result = validateReport({ ...valid, title: `  ${valid.title}  `, author: 'private', userId: 'private' })
    expect(result.title).toBe(valid.title)
    expect(result).not.toHaveProperty('author')
    expect(result).not.toHaveProperty('userId')
  })
  test('requires explicit consent', () => {
    for (const consent of [false, undefined, 'true', 1]) {
      expect(() => validateReport({ ...valid, consent })).toThrow('community guidelines')
    }
  })
  test('rejects malformed, unsupported, oversized, and future inputs', () => {
    const invalid = [
      null, [], {}, { ...valid, title: 'short' }, { ...valid, location: '' },
      { ...valid, body: 'Too short' }, { ...valid, body: 'x'.repeat(5001) },
      { ...valid, title: 'x'.repeat(121) }, { ...valid, platform: 'Other' },
      { ...valid, category: 'Other' }, { ...valid, stayMonth: '2025-13' },
      { ...valid, stayMonth: '2025-00' }, { ...valid, stayMonth: '2099-01' },
      { ...valid, stayMonth: '1999-12' }, { ...valid, title: 123 },
    ]
    for (const input of invalid) expect(() => validateReport(input)).toThrow()
  })
})

describe('public anonymity boundary', () => {
  test('only serializes the public allowlist', () => {
    const result = publicReport({
      id: 'report-1', title: valid.title, location: valid.location,
      platform: valid.platform, category: valid.category, body: valid.body,
      stay_month: valid.stayMonth, created_at: '2026-01-01T00:00:00.000Z',
      author_hash: 'private-identifier', user_id: 'private-user', email: 'private',
    })
    expect(Object.keys(result).sort()).toEqual(['body', 'category', 'createdAt', 'id', 'location', 'platform', 'stayMonth', 'title'])
    expect(JSON.stringify(result)).not.toContain('private')
    expect(publicReportColumns).not.toContain('author')
    expect(publicReportColumns).not.toContain('*')
  })
})
