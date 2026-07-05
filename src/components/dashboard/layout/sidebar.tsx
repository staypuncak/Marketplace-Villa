'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Building, CalendarCheck, Users,
  MessageSquare, Newspaper, Globe, Settings, UserCircle, LogOut, X,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Villa', href: '/dashboard/villa', icon: Building },
  { label: 'Booking', href: '/dashboard/booking', icon: CalendarCheck },
  { label: 'Customer', href: '/dashboard/customer', icon: Users },
  { label: 'Testimonial', href: '/dashboard/testimonial', icon: MessageSquare },
  { label: 'Blog', href: '/dashboard/blog', icon: Newspaper },
  { label: 'Pengaturan Website', href: '/dashboard/website', icon: Globe },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

type SidebarProps = {
  collapsed: boolean
  open: boolean
  onClose: () => void
}

export function Sidebar({ collapsed, open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  const navLink = (href: string, Icon: React.ElementType, label: string, mobile = false) => {
    const active = isActive(href)
    return (
      <Link
        key={href}
        href={href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          active
            ? 'bg-emerald-50 font-semibold text-emerald-700'
            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
          !mobile && collapsed && 'justify-center px-2',
        )}
      >
        <Icon className={cn('size-5 shrink-0', active && 'text-emerald-600')} />
        {(!collapsed || mobile) && <span>{label}</span>}
      </Link>
    )
  }

  return (
    <>
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-30 transition-all duration-300',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        <div className={cn('flex items-center h-16 border-b border-gray-200 px-4', collapsed && 'justify-center px-0')}>
          <img src="/images/logo-mark.png" alt="StayPuncak" className={cn('h-7 w-auto brightness-0', collapsed ? '' : 'mr-2')} />
          {!collapsed && <span className="text-lg font-bold tracking-tight text-gray-900">StayPuncak</span>}
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {navItems.map((item) => navLink(item.href, item.icon, item.label))}
        </nav>

        <div className="border-t border-gray-200 p-3 space-y-0.5">
          <Link
            href="/dashboard/profile"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800',
              collapsed && 'justify-center px-2',
            )}
          >
            <UserCircle className="size-5 shrink-0" />
            {!collapsed && <span>Profile</span>}
          </Link>
          <form action="/logout" method="POST">
            <button
              type="submit"
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800',
                collapsed && 'justify-center px-2',
              )}
            >
              <LogOut className="size-5 shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </form>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
              <div className="flex items-center gap-2">
                <img src="/images/logo-mark.png" alt="StayPuncak" className="h-7 w-auto brightness-0" />
                <span className="text-lg font-bold tracking-tight text-gray-900">StayPuncak</span>
              </div>
              <button onClick={onClose} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
                <X className="size-5" />
              </button>
            </div>
            <nav className="overflow-y-auto p-3 space-y-0.5">
              {navItems.map((item) => navLink(item.href, item.icon, item.label, true))}
            </nav>
            <div className="border-t border-gray-200 p-3 space-y-0.5">
              <Link
                href="/dashboard/profile"
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
              >
                <UserCircle className="size-5 shrink-0" />
                <span>Profile</span>
              </Link>
              <form action="/logout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition-all duration-200 hover:bg-gray-100 hover:text-gray-800"
                >
                  <LogOut className="size-5 shrink-0" />
                  <span>Logout</span>
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
