import { ThemeProvider } from '@/lib/theme-context'
import { SiteHeader } from '@/components/public/site-header'
import { SiteFooter } from '@/components/public/site-footer'
import { WhatsAppFloat } from '@/components/public/whatsapp-float'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppFloat />
    </ThemeProvider>
  )
}
