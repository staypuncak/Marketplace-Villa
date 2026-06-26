export const siteConfig = {
  name: 'StayPuncak',
  description: 'Platform digital penyewaan villa di Puncak Bogor',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  locale: 'id_ID',
  localeDefault: 'id' as const,
  localeAlternate: ['en'] as const,
}
