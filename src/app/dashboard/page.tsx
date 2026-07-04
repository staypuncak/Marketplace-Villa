import { Building, CalendarCheck, MessageSquare, Star } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const stats = [
  { label: 'Total Villa', value: '5', icon: Building, change: '+2 this month' },
  { label: 'Active Booking', value: '12', icon: CalendarCheck, change: '+3 today' },
  { label: 'Testimonials', value: '24', icon: MessageSquare, change: '5 new' },
  { label: 'Rating', value: '4.9', icon: Star, change: 'From 128 reviews' },
]

const activities = [
  { action: 'Booking baru untuk Villa Kirana', time: '2 menit lalu' },
  { action: 'Testimonial baru dari Ibu Sarah', time: '1 jam lalu' },
  { action: 'Pembayaran dikonfirmasi: Villa Savana', time: '3 jam lalu' },
  { action: 'Villa Highland diupdate', time: '1 hari lalu' },
]

const quickActions = [
  { label: 'Tambah Villa Baru', icon: Building },
  { label: 'Kelola Booking', icon: CalendarCheck },
  { label: 'Atur Testimonial', icon: MessageSquare },
  { label: 'Update Blog', icon: Star },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Good Morning,</h2>
        <p className="mt-1 text-gray-500">Welcome back to your StayPuncak dashboard.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <stat.icon className="size-5" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
          <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
          <div className="mt-4 space-y-4">
            {activities.map((item, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700">{item.action}</p>
                  <p className="text-xs text-gray-400">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <action.icon className="size-4 text-emerald-600" />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
