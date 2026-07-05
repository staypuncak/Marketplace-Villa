'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search, Users, Phone, Mail,
  ExternalLink, MessageCircle, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type CustomerItem = {
  id: string
  name: string
  phone: string | null
  email: string | null
  totalBookings: number
  lastBookingAt: string | null
  favoriteVillaId: string | null
  status: string
  createdAt: string
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const statusOptions = ['Semua', 'Aktif', 'VIP', 'Repeat Customer']
const statusFilterMap: Record<string, string | undefined> = {
  'Semua': undefined,
  'Aktif': 'active',
  'VIP': 'vip',
  'Repeat Customer': 'repeat',
}

function CustomerCard({
  customer,
  onWhatsApp,
}: {
  customer: CustomerItem
  onWhatsApp: (phone: string) => void
}) {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
            {initials(customer.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-gray-900">
                {customer.name}
              </h3>
              {customer.totalBookings > 1 && (
                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                  Repeat
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
              {customer.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="size-3" />
                  {customer.phone}
                </span>
              )}
              {customer.email && (
                <span className="flex items-center gap-1">
                  <Mail className="size-3" />
                  {customer.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-sm">
          <div>
            <p className="text-[11px] text-gray-400">Total Booking</p>
            <p className="mt-0.5 font-semibold text-gray-800">{customer.totalBookings}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Terakhir Booking</p>
            <p className="mt-0.5 font-medium text-gray-800">{formatDate(customer.lastBookingAt)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          {customer.phone ? (
            <button
              onClick={() => onWhatsApp(customer.phone!)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
            >
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400">
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">No WA</span>
            </div>
          )}
          <Link
            href={`/dashboard/customer/${customer.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">Detail</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CustomerPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [statusOpen, setStatusOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let cancelled = false

    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .order('last_booking_at', { ascending: false })
          .order('created_at', { ascending: false })

        if (cancelled) return
        if (error) throw error

        setCustomers((data ?? []).map((row) => ({
          id: row.id,
          name: row.name,
          phone: row.phone,
          email: row.email,
          totalBookings: row.total_bookings,
          lastBookingAt: row.last_booking_at,
          favoriteVillaId: row.favorite_villa_id,
          status: row.status,
          createdAt: row.created_at,
        })))
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch customers:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCustomers()
    return () => { cancelled = true }
  }, [supabase])

  const filtered = customers.filter((c) => {
    const statusMatch = !statusFilterMap[statusFilter] || c.status === statusFilterMap[statusFilter]
    if (statusFilter === 'Repeat Customer') {
      if (c.totalBookings < 2) return false
    }
    const searchMatch = !search
      || c.name.toLowerCase().includes(search.toLowerCase())
      || (c.phone && c.phone.includes(search))
      || (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
    return statusMatch && searchMatch
  })

  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const newThisMonth = customers.filter((c) => c.createdAt >= firstOfMonth).length
  const repeat = customers.filter((c) => c.totalBookings > 1).length
  const totalBookings = customers.reduce((sum, c) => sum + c.totalBookings, 0)

  const kpis = [
    { label: 'Total Customer', value: customers.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Customer Baru Bulan Ini', value: newThisMonth, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Repeat Customer', value: repeat, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Booking', value: totalBookings, color: 'text-purple-600', bg: 'bg-purple-50' },
  ]

  const handleWhatsApp = (phone: string) => {
    const waUrl = `https://wa.me/${phone}`
    window.open(waUrl, '_blank', 'noopener')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Kelola Customer</h2>
          <p className="mt-1 text-sm text-gray-500">
            Lihat seluruh pelanggan dan riwayat interaksi mereka.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className={cn('rounded-xl p-4', kpi.bg)}>
            <p className="text-xs font-medium text-gray-500">{kpi.label}</p>
            <p className={cn('mt-1 text-2xl font-bold', kpi.color)}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, telepon, atau email..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
          >
            {statusFilter}
            <ChevronDown className="size-4 text-gray-400" />
          </button>
          {statusOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setStatusOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setStatusOpen(false) }}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-left text-sm',
                      statusFilter === opt ? 'text-emerald-700' : 'text-gray-600 hover:bg-gray-50',
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-300">
            <Users className="size-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Belum ada customer</h3>
          <p className="mt-1 text-sm text-gray-500">
            Customer akan muncul secara otomatis saat ada booking.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onWhatsApp={handleWhatsApp}
            />
          ))}
        </div>
      )}
    </div>
  )
}
