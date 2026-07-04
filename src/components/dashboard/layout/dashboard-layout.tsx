'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { cn } from '@/lib/utils'

type DashboardLayoutProps = {
  children: React.ReactNode
  title?: string
}

export function DashboardLayout({ children, title = 'Dashboard' }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        collapsed={collapsed}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'lg:ml-16' : 'lg:ml-60',
        )}
      >
        <Topbar
          title={title}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onToggleMobile={() => setMobileOpen(true)}
        />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
