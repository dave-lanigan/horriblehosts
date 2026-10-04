export const platforms = ['Airbnb', 'Vrbo'] as const
export const categories = ['Host behavior', 'Not as advertised', 'Cleanliness', 'Hidden fees', 'Safety', 'Cancellation'] as const

export interface Report {
  id: string
  title: string
  platform: typeof platforms[number]
  category: typeof categories[number]
  location: string
  stayMonth: string
  body: string
  createdAt: string
}

export interface ReportInput extends Omit<Report, 'id' | 'createdAt'> {
  consent: boolean
}

export interface ReportFeed {
  reports: Report[]
  total: number
  page: number
  pageSize: number
  demo: boolean
  stats: { total: number; airbnb: number; vrbo: number }
}

export function validateReport(value: unknown): ReportInput {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Please provide a report.')
  }
  const input = value as Record<string, unknown>
  function text(key: string, label: string, min: number, max: number) {
    const value = input[key]
    if (typeof value !== 'string' || value.trim().length < min || value.trim().length > max) {
      throw new Error(`${label} must be between ${min} and ${max} characters.`)
    }
    return value.trim()
  }
  const title = text('title', 'Title', 10, 120)
  const location = text('location', 'City and country', 3, 100)
  const body = text('body', 'Your story', 80, 5000)
  if (!platforms.includes(input.platform as Report['platform'])) {
    throw new Error('Choose Airbnb or Vrbo.')
  }
  if (!categories.includes(input.category as Report['category'])) {
    throw new Error('Choose a report category.')
  }
  const stayMonth = text('stayMonth', 'Stay month', 7, 7)
  const currentMonth = new Date().toISOString().slice(0, 7)
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(stayMonth) || stayMonth < '2000-01' || stayMonth > currentMonth) {
    throw new Error('Choose a valid past or current stay month.')
  }
  if (input.consent !== true) {
    throw new Error('Please confirm the community guidelines before posting.')
  }
  return {
    title, location, body, stayMonth,
    platform: input.platform as Report['platform'],
    category: input.category as Report['category'],
    consent: true,
  }
}
