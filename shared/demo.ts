import type { Report } from './reports'

// Fictional examples are only shown when no database is configured.
export const demoReports: Report[] = [
  {
    id: 'example-1',
    title: 'The “quiet retreat” came with construction at 7 a.m.',
    platform: 'Airbnb',
    category: 'Not as advertised',
    location: 'Example city, USA',
    stayMonth: '2026-01',
    body: 'We booked a quiet place to unwind. When we arrived, the building next door was under renovation, with drilling starting early every morning. The listing never mentioned it. When we asked about moving our stay, the host told us to buy earplugs. A little transparency before booking would have made all the difference.',
    createdAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'example-2',
    title: 'A cleaning fee, but no sign that anyone had cleaned',
    platform: 'Vrbo',
    category: 'Cleanliness',
    location: 'Example town, UK',
    stayMonth: '2026-01',
    body: 'We arrived to find used towels in the bathroom and food left in the refrigerator. We documented the condition and contacted our host through the booking platform. They said the previous guests were responsible and offered no help. We spent the first evening cleaning instead of enjoying our trip.',
    createdAt: '2026-02-03T12:00:00.000Z',
  },
  {
    id: 'example-3',
    title: 'The extra charges only appeared after check-in',
    platform: 'Airbnb',
    category: 'Hidden fees',
    location: 'Example village, France',
    stayMonth: '2025-12',
    body: 'After checking in, we received a message asking for additional payments for heating and linens. Neither charge was disclosed in the listing when we booked. We kept all communication on the platform and asked support to review the charges. My advice: save the original listing and never pay unexpected fees off-platform.',
    createdAt: '2026-02-02T12:00:00.000Z',
  },
]
