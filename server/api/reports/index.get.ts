import { categories, platforms, type ReportFeed } from '../../../shared/reports'
import { demoReports } from '../../../shared/demo'
import { database, publicReport, publicReportColumns } from '../../utils/database'

export default defineEventHandler(async (event): Promise<ReportFeed> => {
  setHeader(event, 'Cache-Control', 'no-store')
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  const platform = platforms.find(value => value === query.platform)
  const category = categories.find(value => value === query.category)
  const page = Math.min(1000, Math.max(1, Math.floor(Number(query.page) || 1)))
  const pageSize = 12
  const oldest = query.sort === 'oldest'

  if (!useRuntimeConfig().tursoDatabaseUrl) {
    const reports = demoReports.filter(report =>
      (!platform || report.platform === platform)
      && (!category || report.category === category)
      && (!q || `${report.title} ${report.location} ${report.body}`.toLowerCase().includes(q.toLowerCase())),
    ).sort((a, b) => oldest ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt))
    return {
      reports: reports.slice((page - 1) * pageSize, page * pageSize),
      total: reports.length, page, pageSize, demo: true,
      stats: { total: demoReports.length, airbnb: 2, vrbo: 1 },
    }
  }

  const db = await database()
  const clauses: string[] = []
  const args: string[] = []
  if (platform) { clauses.push('platform = ?'); args.push(platform) }
  if (category) { clauses.push('category = ?'); args.push(category) }
  if (q) {
    clauses.push("(title LIKE ? ESCAPE '\\' OR location LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\')")
    const pattern = `%${q.replace(/[\\%_]/g, '\\$&')}%`
    args.push(pattern, pattern, pattern)
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const [posts, count, stats] = await db.batch([
    {
      sql: `SELECT ${publicReportColumns} FROM reports ${where} ORDER BY created_at ${oldest ? 'ASC' : 'DESC'}, id ${oldest ? 'ASC' : 'DESC'} LIMIT ? OFFSET ?`,
      args: [...args, pageSize, (page - 1) * pageSize],
    },
    { sql: `SELECT COUNT(*) AS total FROM reports ${where}`, args },
    "SELECT COUNT(*) AS total, COALESCE(SUM(platform = 'Airbnb'), 0) AS airbnb, COALESCE(SUM(platform = 'Vrbo'), 0) AS vrbo FROM reports",
  ], 'read')
  return {
    reports: posts!.rows.map(publicReport),
    total: Number(count!.rows[0]!.total),
    page, pageSize, demo: false,
    stats: {
      total: Number(stats!.rows[0]!.total),
      airbnb: Number(stats!.rows[0]!.airbnb),
      vrbo: Number(stats!.rows[0]!.vrbo),
    },
  }
})
