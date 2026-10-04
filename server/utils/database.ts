import { createClient, type Client, type Row } from '@libsql/client'
import type { Report } from '../../shared/reports'

let client: Client | undefined
let initialization: Promise<unknown> | undefined

export async function database() {
  const config = useRuntimeConfig()
  if (!config.tursoDatabaseUrl) {
    throw createError({ statusCode: 503, message: 'Report storage is not configured yet.' })
  }
  client ??= createClient({
    url: config.tursoDatabaseUrl,
    authToken: config.tursoAuthToken || undefined,
  })
  initialization ??= client.batch([
    `CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      author_hash TEXT NOT NULL,
      title TEXT NOT NULL,
      platform TEXT NOT NULL CHECK (platform IN ('Airbnb', 'Vrbo')),
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      stay_month TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`,
    'CREATE INDEX IF NOT EXISTS reports_created_at ON reports(created_at DESC, id DESC)',
    'CREATE INDEX IF NOT EXISTS reports_author_created_at ON reports(author_hash, created_at)',
  ], 'write').catch((error) => {
    initialization = undefined
    throw error
  })
  await initialization
  return client
}

export const publicReportColumns = 'id, title, platform, category, location, stay_month, body, created_at'

export function publicReport(row: Row): Report {
  return {
    id: String(row.id),
    title: String(row.title),
    platform: String(row.platform) as Report['platform'],
    category: String(row.category) as Report['category'],
    location: String(row.location),
    stayMonth: String(row.stay_month),
    body: String(row.body),
    createdAt: String(row.created_at),
  }
}
