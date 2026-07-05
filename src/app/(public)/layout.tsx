import type { Metadata } from 'next'
import { ThemeProvider } from '@/lib/theme-context'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { WhatsAppFloat } from '@/components/public/whatsapp-float'
import { getWebsiteSettings } from '@/lib/supabase/queries'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getWebsiteSettings()

  return {
    title: {
      default: settings.seo.siteTitle,
      template: `%s | ${settings.seo.siteTitle}`,
    },
    description: settings.seo.metaDescription,
    openGraph: {
      title: settings.seo.siteTitle,
      description: settings.seo.metaDescription,
      ...(settings.seo.ogImage ? { images: [{ url: settings.seo.ogImage }] } : {}),
    },
  }
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getWebsiteSettings()

  return (
    <ThemeProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings.footer} />
      <WhatsAppFloat settings={settings.contact} />
    </ThemeProvider>
  )
}
