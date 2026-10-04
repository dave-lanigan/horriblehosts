import { createHmac, randomUUID } from 'node:crypto'
import { validateReport, type Report } from '../../../shared/reports'
import { database } from '../../utils/database'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  const auth = event.context.auth?.({ acceptsToken: 'session_token' })
  if (!auth?.userId) {
    throw createError({ statusCode: 401, message: 'Sign in to share your story.' })
  }
  const origin = getHeader(event, 'origin')
  if (!origin || origin !== getRequestURL(event).origin || getHeader(event, 'sec-fetch-site') === 'cross-site') {
    throw createError({ statusCode: 403, message: 'Please submit your report from this website.' })
  }
  if (!getHeader(event, 'content-type')?.startsWith('application/json')) {
    throw createError({ statusCode: 415, message: 'A JSON report is required.' })
  }
  let input
  try {
    input = validateReport(await readBody(event))
  } catch (error) {
    throw createError({ statusCode: 400, message: error instanceof Error ? error.message : 'Invalid report.' })
  }
  const config = useRuntimeConfig()
  if (!config.postAuthorSecret || config.postAuthorSecret.length < 32) {
    throw createError({ statusCode: 503, message: 'Posting is not configured yet.' })
  }
  const db = await database()
  const authorHash = createHmac('sha256', config.postAuthorSecret).update(auth.userId).digest('hex')
  const report: Report = {
    id: randomUUID(),
    title: input.title,
    platform: input.platform,
    category: input.category,
    location: input.location,
    stayMonth: input.stayMonth,
    body: input.body,
    createdAt: new Date().toISOString(),
  }
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  // The quota check and insert are atomic, including across serverless instances.
  const result = await db.execute({
    sql: `INSERT INTO reports (id, author_hash, title, platform, category, location, stay_month, body, created_at)
      SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?
      WHERE (SELECT COUNT(*) FROM reports WHERE author_hash = ? AND created_at >= ?) < 5`,
    args: [
      report.id, authorHash, report.title, report.platform, report.category,
      report.location, report.stayMonth, report.body, report.createdAt, authorHash, since,
    ],
  })
  if (!result.rowsAffected) {
    throw createError({ statusCode: 429, message: 'You can share up to five stories in 24 hours. Please try again later.' })
  }
  setResponseStatus(event, 201)
  return { report }
})
