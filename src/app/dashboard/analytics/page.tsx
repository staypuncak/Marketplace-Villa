'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  BarChart3, CalendarCheck, UserPlus, Building,
  CheckCircle2, XCircle, Phone, Users, Star,
  Loader2, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type BookingRow = Tables<'bookings'>
type CustomerRow = Tables<'customers'>

type DateFilter = 'month' | '30days' | 'all'

type StatusCount = {
  status: string
  label: string
  count: number
}

type VillaRank = {
  name: string
  count: number
}

const kpiConfig: { label: string; key: string; icon: React.ElementType; color: string }[] = [
  { label: 'Total Booking', key: 'totalBooking', icon: CalendarCheck, color: 'text-blue-600 bg-blue-100' },
  { label: 'Booking Bulan Ini', key: 'bookingMonth', icon: BarChart3, color: 'text-emerald-600 bg-emerald-100' },
  { label: 'Customer Baru', key: 'newCustomers', icon: UserPlus, color: 'text-purple-600 bg-purple-100' },
  { label: 'Villa Aktif', key: 'activeVillas', icon: Building, color: 'text-amber-600 bg-amber-100' },
  { label: 'Booking Dikonfirmasi', key: 'confirmedBookings', icon: CheckCircle2, color: 'text-teal-600 bg-teal-100' },
  { label: 'Booking Dibatalkan', key: 'cancelledBookings', icon: XCircle, color: 'text-red-600 bg-red-100' },
]

const statusLabelMap: Record<string, string> = {
  new: 'Booking Baru',
  pending: 'Booking Baru',
  pending_confirmation: 'Menunggu Konfirmasi',
  confirmed: 'Dikonfirmasi',
  checked_in: 'Check-in',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

const statusColorMap: Record<string, string> = {
  new: 'bg-blue-500',
  pending: 'bg-blue-500',
  pending_confirmation: 'bg-amber-500',
  confirmed: 'bg-emerald-500',
  checked_in: 'bg-purple-500',
  completed: 'bg-gray-400',
  cancelled: 'bg-red-500',
}

function toStartOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'baru saja'
  if (diffMin < 60) return `${diffMin} menit yang lalu`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} jam yang lalu`
  const diffDay = Math.floor(diffHour / 24)
  if (diffDay < 7) return `${diffDay} hari yang lalu`
  return formatDate(dateStr)
}

export default function AnalyticsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState<DateFilter>('month')
  const [showFilter, setShowFilter] = useState(false)

  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [activeVillaCount, setActiveVillaCount] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingsRes, customersRes, villasRes] = await Promise.all([
          supabase.from('bookings').select('*').order('created_at', { ascending: false }),
          supabase.from('customers').select('*'),
          supabase.from('villas').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        ])

        setBookings(bookingsRes.data ?? [])
        setCustomers(customersRes.data ?? [])
        setActiveVillaCount(villasRes.count ?? 0)
      } catch (err) {
        console.error('Analytics fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

  const dateCutoff = useMemo(() => {
    if (dateFilter === 'month') return toStartOfMonth(new Date())
    if (dateFilter === '30days') return daysAgo(30)
    return null
  }, [dateFilter])

  const filteredBookings = useMemo(() => {
    if (!dateCutoff) return bookings
    return bookings.filter((b) => {
      const created = new Date(b.created_at)
      return created >= dateCutoff
    })
  }, [bookings, dateCutoff])

  const activeVillas = activeVillaCount

  const totalBooking = bookings.length
  const bookingMonth = filteredBookings.length
  const confirmedBookings = filteredBookings.filter((b) => b.status === 'confirmed').length
  const cancelledBookings = filteredBookings.filter((b) => b.status === 'cancelled').length

  const monthCustomers = useMemo(() => {
    if (!dateCutoff) return customers.length
    return customers.filter((c) => {
      const created = new Date(c.created_at)
      return created >= dateCutoff
    }).length
  }, [customers, dateCutoff])

  const kpiValues: Record<string, number> = {
    totalBooking,
    bookingMonth,
    newCustomers: monthCustomers,
    activeVillas,
    confirmedBookings,
    cancelledBookings,
  }

  const bookingByStatus = useMemo(() => {
    const map = new Map<string, number>()
    filteredBookings.forEach((b) => {
      const s = b.status || 'unknown'
      map.set(s, (map.get(s) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([status, count]) => ({
        status,
        label: statusLabelMap[status] || status,
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }, [filteredBookings])

  const villaRank = useMemo(() => {
    const map = new Map<string, number>()
    filteredBookings.forEach((b) => {
      const name = b.villa_name || 'Unknown'
      map.set(name, (map.get(name) || 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [filteredBookings])

  const totalCustomers = customers.length
  const repeatCustomers = customers.filter((c) => (c.total_bookings || 0) > 1).length
  const repeatRate = totalCustomers > 0 ? ((repeatCustomers / totalCustomers) * 100).toFixed(1) : '0'

  const recentLeads = bookings.slice(0, 5)

  const maxStatusCount = bookingByStatus.length > 0 ? Math.max(...bookingByStatus.map((s) => s.count)) : 1
  const maxVillaCount = villaRank.length > 0 ? Math.max(...villaRank.map((v) => v.count)) : 1

  const filterLabels: Record<DateFilter, string> = {
    month: 'Bulan Ini',
    '30days': '30 Hari Terakhir',
    all: 'Semua Waktu',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
          <p className="mt-1 text-sm text-gray-500">
            Pantau performa booking, villa, dan customer StayPuncak.
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            {filterLabels[dateFilter]}
            <ChevronDown className="size-4" />
          </button>
          {showFilter && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowFilter(false)} />
              <div className="absolute right-0 z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {(Object.keys(filterLabels) as DateFilter[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setDateFilter(key); setShowFilter(false) }}
                    className={cn(
                      'w-full px-4 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                      dateFilter === key ? 'font-semibold text-emerald-700' : 'text-gray-700',
                    )}
                  >
                    {filterLabels[key]}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {kpiConfig.map((kpi) => (
          <div key={kpi.key} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                {kpi.label}
              </span>
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', kpi.color)}>
                <kpi.icon className="size-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {kpiValues[kpi.key]?.toLocaleString('id-ID') || 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Booking by Status</h3>
          <p className="mt-0.5 text-xs text-gray-400">Distribusi status booking periode ini</p>
          {bookingByStatus.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-400">Belum ada data booking</p>
          ) : (
            <div className="mt-4 space-y-3">
              {bookingByStatus.map((item) => (
                <div key={item.status} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', statusColorMap[item.status] || 'bg-gray-400')}
                      style={{ width: `${(item.count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Villa Terpopuler</h3>
          <p className="mt-0.5 text-xs text-gray-400">Ranking villa berdasarkan jumlah booking</p>
          {villaRank.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-400">Belum ada data booking</p>
          ) : (
            <div className="mt-4 space-y-3">
              {villaRank.map((item, i) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
                      <span className={cn('text-gray-700', i === 0 && 'font-semibold')}>{item.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900">{item.count}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${(item.count / maxVillaCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Retensi Customer</h3>
          <p className="mt-0.5 text-xs text-gray-400">Loyalitas customer berdasarkan data repeat booking</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
              <p className="mt-1 text-xs text-gray-400">Total Customer</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{repeatCustomers}</p>
              <p className="mt-1 text-xs text-gray-400">Repeat Customer</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">{repeatRate}%</p>
              <p className="mt-1 text-xs text-gray-400">Repeat Rate</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900">Recent Leads</h3>
          <p className="mt-0.5 text-xs text-gray-400">5 booking lead terbaru</p>
          {recentLeads.length === 0 ? (
            <p className="mt-6 text-center text-sm text-gray-400">Belum ada lead</p>
          ) : (
            <div className="mt-4 divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
                    <Phone className="size-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {lead.guest_name || lead.guest_phone || 'Anonim'}
                    </p>
                    <p className="truncate text-xs text-gray-400">
                      {lead.villa_name || 'Villa tidak diketahui'} &middot; {timeAgo(lead.created_at)}
                    </p>
                  </div>
                  <span className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    lead.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                    lead.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                    lead.status === 'completed' ? 'bg-gray-100 text-gray-500' :
                    'bg-blue-100 text-blue-700',
                  )}>
                    {statusLabelMap[lead.status] || lead.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
