'use client'

import Link from 'next/link'
import {
  Building, CalendarCheck, Clock, UserCheck,
  Users, BarChart3,
} from 'lucide-react'
import { useDashboard } from '@/lib/dashboard-context'

const kpiCards = [
  { label: 'Villa Aktif', value: '5', icon: Building, change: '+2 this month' },
  { label: 'Booking Baru', value: '12', icon: CalendarCheck, change: '+3 today' },
  { label: 'Menunggu Konfirmasi', value: '3', icon: Clock, change: 'Perlu dicek' },
  { label: 'Check-in Hari Ini', value: '2', icon: UserCheck, change: 'Villa Kirana & Highland' },
]

const quickActions = [
  { label: 'Kelola Villa', desc: 'Atur villa dan fasilitas', icon: Building, href: '/dashboard/villa' },
  { label: 'Kelola Booking', desc: 'Lihat booking terbaru', icon: CalendarCheck, href: '/dashboard/booking' },
  { label: 'Kelola Customer', desc: 'Data dan riwayat customer', icon: Users, href: '/dashboard/customer' },
  { label: 'Analytics', desc: 'Pantau performa bisnis', icon: BarChart3, href: '/dashboard/analytics' },
]

const activities = [
  { action: 'Booking baru untuk Villa Kirana', time: '2 menit lalu', type: 'booking' },
  { action: 'Testimonial baru dari Ibu Sarah', time: '1 jam lalu', type: 'general' },
  { action: 'Pembayaran dikonfirmasi: Villa Savana', time: '3 jam lalu', type: 'confirm' },
  { action: 'Villa Highland diupdate', time: '1 hari lalu', type: 'update' },
  { action: 'Artikel baru: Tips Liburan Puncak', time: '2 hari lalu', type: 'article' },
]

const activityColors: Record<string, string> = {
  booking: 'bg-emerald-400',
  confirm: 'bg-amber-400',
  update: 'bg-blue-400',
  article: 'bg-purple-400',
  general: 'bg-gray-300',
}

const websiteStatus = [
  { label: 'Hero Aktif', active: true },
  { label: 'WhatsApp Aktif', active: true },
  { label: 'Semua Villa Online', active: true },
  { label: 'SEO Homepage Lengkap', active: true },
]

export default function DashboardPage() {
  const { adminName } = useDashboard()
  const firstName = adminName.split(' ')[0] || 'Admin'

  return (
    <div className="space-y-8 select-none">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Selamat Datang Kembali, {firstName} 👋
        </h2>
        <p className="mt-1.5 text-gray-500">
          Semoga hari ini membawa banyak booking baru.
        </p>
        <p className="mt-0.5 text-sm text-gray-400">
          Kelola seluruh operasional StayPuncak dari satu tempat.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:shadow-md active:scale-[0.98] active:shadow-sm cursor-default min-h-[104px]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</span>
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <stat.icon className="size-4 sm:size-5" />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-900">Aktivitas Terbaru</h3>
          <div className="mt-4 space-y-1">
            {activities.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-gray-100 px-2 py-3 last:border-0 active:bg-gray-50/50 rounded-lg transition-colors"
              >
                <div
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${activityColors[item.type] || 'bg-gray-300'}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700">{item.action}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Aksi Cepat</h3>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-3.5 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm active:scale-[0.98] active:bg-emerald-100/50 min-h-[52px] cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <action.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Status Website</h3>
            <div className="mt-4 space-y-3">
              {websiteStatus.map((item) => (
                <div key={item.label} className="flex items-center gap-3 min-h-[36px]">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${item.active ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
