import { demoReports } from '../../../shared/demo'
import { database, publicReport, publicReportColumns } from '../../utils/database'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'no-store')
  const id = getRouterParam(event, 'id') || ''
  if (!useRuntimeConfig().tursoDatabaseUrl) {
    const report = demoReports.find(report => report.id === id)
    if (!report) throw createError({ statusCode: 404, message: 'Report not found.' })
    return { report, demo: true }
  }
  const db = await database()
  const result = await db.execute({ sql: `SELECT ${publicReportColumns} FROM reports WHERE id = ?`, args: [id] })
  if (!result.rows[0]) throw createError({ statusCode: 404, message: 'Report not found.' })
  return { report: publicReport(result.rows[0]), demo: false }
})
