import { afterAll, beforeAll, describe, expect, test } from 'bun:test'
import { createServer, type Server } from 'node:http'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import {
  createApp, createError, defineEventHandler, getHeader, getQuery, getRequestURL,
  readBody, setHeader, setResponseStatus, toNodeListener,
} from 'h3'

let server: Server
let origin: string
let directory: string
let authenticated = false

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), 'horriblehosts-test-'))
  // Nitro globals are supplied by the application in production.
  Object.assign(globalThis, {
    createError, defineEventHandler, getHeader, getQuery, getRequestURL,
    readBody, setHeader, setResponseStatus,
    useRuntimeConfig: () => ({
      tursoDatabaseUrl: `file:${join(directory, 'reports.db')}`,
      tursoAuthToken: '',
      postAuthorSecret: 'test-only-author-secret-not-a-real-credential',
    }),
  })
  const { default: post } = await import('../server/api/reports/index.post')
  const { default: get } = await import('../server/api/reports/index.get')
  const app = createApp().use(defineEventHandler(async event => {
    event.context.auth = () => ({ userId: authenticated ? 'test-user' : null })
    return event.method === 'POST' ? post(event) : get(event)
  }))
  server = createServer(toNodeListener(app))
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve))
  const address = server.address()
  if (!address || typeof address === 'string') throw new Error('No test server address')
  origin = `http://127.0.0.1:${address.port}`
})

afterAll(async () => {
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()))
  await rm(directory, { recursive: true, force: true })
})

const report = {
  title: 'The promised quiet stay was not quiet',
  platform: 'Airbnb',
  category: 'Not as advertised',
  location: 'Test city, Test country',
  stayMonth: '2025-12',
  body: 'Construction started very early every morning. This was not disclosed in the listing and our host did not respond to our questions about it.',
  consent: true,
  userId: 'spoofed-user',
}
function post(body: unknown = report, requestOrigin = origin, contentType = 'application/json') {
  return fetch(`${origin}/api/reports`, {
    method: 'POST',
    headers: { Origin: requestOrigin, 'Content-Type': contentType },
    body: JSON.stringify(body),
  })
}

describe('report API', () => {
  test('public reads work on an empty configured database and writes need authentication', async () => {
    const response = await fetch(`${origin}/api/reports`)
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ demo: false, total: 0, reports: [] })
    expect((await post()).status).toBe(401)
  })
  test('authenticated requests still require same-origin JSON and valid content', async () => {
    authenticated = true
    expect((await post(report, 'https://other.example')).status).toBe(403)
    expect((await post(report, origin, 'text/plain')).status).toBe(415)
    expect((await post({ ...report, consent: false })).status).toBe(400)
    expect((await post({ ...report, body: 'too short' })).status).toBe(400)
  })
  test('persists five posts, returns no identity, and rejects the sixth atomically', async () => {
    for (let index = 0; index < 5; index++) {
      const response = await post()
      expect(response.status).toBe(201)
      const result = await response.json()
      expect(result.report.title).toBe(report.title)
      expect(JSON.stringify(result)).not.toContain('test-user')
      expect(result.report).not.toHaveProperty('author_hash')
      expect(result.report).not.toHaveProperty('userId')
    }
    expect((await post()).status).toBe(429)
    authenticated = false
    const response = await fetch(`${origin}/api/reports`)
    expect(response.headers.get('cache-control')).toBe('no-store')
    const feed = await response.json()
    expect(feed.total).toBe(5)
    expect(feed.stats).toMatchObject({ total: 5, airbnb: 5, vrbo: 0 })
    expect(JSON.stringify(feed)).not.toContain('author')
  })
  test('search is parameterized, wildcard characters are literal, and filters work', async () => {
    const searches = [
      ['q=construction', 5],
      ['platform=Vrbo', 0],
      ['category=Cleanliness', 0],
      ['q=%25', 0],
      ['q=%27%20OR%201%3D1%20--', 0],
    ] as const
    for (const [query, total] of searches) {
      const response = await fetch(`${origin}/api/reports?${query}`)
      expect(response.status).toBe(200)
      expect((await response.json()).total).toBe(total)
    }
  })
})
