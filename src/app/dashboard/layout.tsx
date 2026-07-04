import { requireAdmin } from '@/lib/supabase/auth'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return <DashboardLayout>{children}</DashboardLayout>
}
