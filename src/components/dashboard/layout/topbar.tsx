'use client'

import { Bell, PanelLeftOpen, PanelLeftClose, ChevronDown } from 'lucide-react'
import { useDashboard } from '@/lib/dashboard-context'

type TopbarProps = {
  title: string
  collapsed: boolean
  onToggleCollapse: () => void
  onToggleMobile: () => void
}

export function Topbar({ title, collapsed, onToggleCollapse, onToggleMobile }: TopbarProps) {
  const { adminName } = useDashboard()
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <PanelLeftOpen className="size-5" />
        </button>

        <button
          onClick={onToggleCollapse}
          className="hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:block"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeftOpen className="size-5" /> : <PanelLeftClose className="size-5" />}
        </button>

        <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="Notifications">
          <Bell className="size-5" />
        </button>
        <div className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-medium text-white">
            {initials || 'A'}
          </div>
          <span className="hidden text-sm font-medium text-gray-700 sm:block">{adminName || 'Admin'}</span>
          <ChevronDown className="hidden size-4 text-gray-400 sm:block" />
        </div>
      </div>
    </header>
  )
}
