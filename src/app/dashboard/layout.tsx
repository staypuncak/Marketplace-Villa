import { requireAdmin } from '@/lib/supabase/auth'
import { DashboardLayout } from '@/components/dashboard/layout/dashboard-layout'
import { DashboardProvider } from '@/lib/dashboard-context'

export default async function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { admin } = await requireAdmin()

  return (
    <DashboardProvider adminName={admin.name}>
      <DashboardLayout>{children}</DashboardLayout>
    </DashboardProvider>
  )
}
