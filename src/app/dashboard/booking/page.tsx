'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Search, Plus, ChevronDown, Phone, ExternalLink, Pencil,
  CalendarDays, Users, MapPin, Building,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type BookingRow = Tables<'bookings'>

type BookingStatus = 'baru' | 'menunggu' | 'confirmed' | 'checkin' | 'completed' | 'cancelled'

type BookingItem = {
  id: string
  guestName: string
  guestPhone: string | null
  villaName: string
  villaLocation: string
  checkIn: string
  checkOut: string
  totalGuest: number | null
  status: BookingStatus
  createdAt: string
  rawCreatedAt: string
}

const statusConfig: Record<BookingStatus, { label: string; class: string }> = {
  baru: { label: 'Booking Baru', class: 'bg-blue-100 text-blue-700' },
  menunggu: { label: 'Menunggu Konfirmasi', class: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Dikonfirmasi', class: 'bg-emerald-100 text-emerald-700' },
  checkin: { label: 'Check-in', class: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Selesai', class: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Dibatalkan', class: 'bg-red-100 text-red-600' },
}

const dbStatusToLocal: Record<string, BookingStatus> = {
  new: 'baru',
  pending_confirmation: 'menunggu',
  confirmed: 'confirmed',
  checked_in: 'checkin',
  completed: 'completed',
  cancelled: 'cancelled',
  pending: 'baru',
}

const statusOptions = ['Semua', 'Booking Baru', 'Menunggu Konfirmasi', 'Dikonfirmasi', 'Check-in', 'Selesai', 'Dibatalkan']
const dateOptions = ['Semua Waktu', 'Hari Ini', 'Minggu Ini', 'Bulan Ini']

const statusFilterMap: Record<string, BookingStatus | undefined> = {
  'Semua': undefined,
  'Booking Baru': 'baru',
  'Menunggu Konfirmasi': 'menunggu',
  'Dikonfirmasi': 'confirmed',
  'Check-in': 'checkin',
  'Selesai': 'completed',
  'Dibatalkan': 'cancelled',
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
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function BookingCard({ booking }: { booking: BookingItem }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const status = statusConfig[booking.status]
  const waUrl = booking.guestPhone ? `https://wa.me/${booking.guestPhone}` : null

  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-base font-semibold text-gray-900">
                {booking.guestName}
              </h3>
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                #{booking.id.slice(0, 8)}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-gray-400">{booking.createdAt}</p>
          </div>
          <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold', status.class)}>
            {status.label}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Building className="size-4 shrink-0 text-gray-400" />
          <span className="truncate">{booking.villaName}</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 text-sm">
          <div>
            <p className="text-[11px] text-gray-400">Check-in</p>
            <p className="mt-0.5 font-medium text-gray-800">{formatDate(booking.checkIn)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Check-out</p>
            <p className="mt-0.5 font-medium text-gray-800">{formatDate(booking.checkOut)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Tamu</p>
            <p className="mt-0.5 flex items-center gap-1 font-medium text-gray-800">
              <Users className="size-3.5" />
              {booking.totalGuest ?? '—'} orang
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Total Hari</p>
            <p className="mt-0.5 flex items-center gap-1 font-medium text-gray-800">
              <CalendarDays className="size-3.5" />
              {booking.checkIn && booking.checkOut
                ? Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 3600 * 24)) + ' malam'
                : '—'}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
            >
              <Phone className="size-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          ) : (
            <div className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-400">
              <Phone className="size-4" />
              <span className="hidden sm:inline">No WA</span>
            </div>
          )}
          <Link
            href={`/dashboard/booking/${booking.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">Detail</span>
          </Link>
          <Link
            href={`/dashboard/booking/${booking.id}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Pencil className="size-4" />
            <span className="hidden sm:inline">Edit</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <ChevronDown className="size-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute bottom-full right-0 z-20 mb-1 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                    Batalkan Booking
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function mapBooking(row: BookingRow): BookingItem {
  return {
    id: row.id,
    guestName: row.guest_name || 'Calon Tamu',
    guestPhone: row.guest_phone,
    villaName: row.villa_name || 'Villa',
    villaLocation: '',
    checkIn: row.check_in || '',
    checkOut: row.check_out || '',
    totalGuest: row.guest_count,
    status: dbStatusToLocal[row.status] || 'baru',
    createdAt: timeAgo(row.created_at),
    rawCreatedAt: row.created_at,
  }
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua')
  const [dateFilter, setDateFilter] = useState('Semua Waktu')
  const [villaFilter, setVillaFilter] = useState('Semua Villa')
  const [statusOpen, setStatusOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [villaOpen, setVillaOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let cancelled = false

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })

        if (cancelled) return
        if (error) throw error

        setBookings((data ?? []).map(mapBooking))
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch bookings:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBookings()
    return () => { cancelled = true }
  }, [supabase])

  const uniqueVillas = [...new Set(bookings.map((b) => b.villaName))]

  const filtered = bookings.filter((b) => {
    const statusMatch = !statusFilterMap[statusFilter] || b.status === statusFilterMap[statusFilter]
    const searchMatch = !search || b.guestName.toLowerCase().includes(search.toLowerCase()) || b.villaName.toLowerCase().includes(search.toLowerCase())
    const villaMatch = villaFilter === 'Semua Villa' || b.villaName === villaFilter
    return statusMatch && searchMatch && villaMatch
  })

  const kpis = [
    { label: 'Booking Baru', value: bookings.filter((b) => b.status === 'baru').length, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Menunggu Konfirmasi', value: bookings.filter((b) => b.status === 'menunggu').length, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Check-in Hari Ini', value: bookings.filter((b) => b.status === 'checkin').length, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Check-out Hari Ini', value: 0, color: 'text-gray-600', bg: 'bg-gray-50' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Kelola Booking</h2>
          <p className="mt-1 text-sm text-gray-500">
            Kelola seluruh permintaan booking villa.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700">
          <Plus className="size-4" />
          Booking Baru
        </button>
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
            placeholder="Cari tamu atau villa..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <DropdownFilter
          label={statusFilter}
          options={statusOptions}
          open={statusOpen}
          onToggle={() => { setStatusOpen(!statusOpen); setDateOpen(false); setVillaOpen(false) }}
          onSelect={(v) => { setStatusFilter(v); setStatusOpen(false) }}
          selected={statusFilter}
        />
        <DropdownFilter
          label={dateFilter}
          options={dateOptions}
          open={dateOpen}
          onToggle={() => { setDateOpen(!dateOpen); setStatusOpen(false); setVillaOpen(false) }}
          onSelect={(v) => { setDateFilter(v); setDateOpen(false) }}
          selected={dateFilter}
        />
        <DropdownFilter
          label={villaFilter}
          options={['Semua Villa', ...uniqueVillas]}
          open={villaOpen}
          onToggle={() => { setVillaOpen(!villaOpen); setStatusOpen(false); setDateOpen(false) }}
          onSelect={(v) => { setVillaFilter(v); setVillaOpen(false) }}
          selected={villaFilter}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-300">
            <CalendarDays className="size-8" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900">Belum ada booking</h3>
          <p className="mt-1 text-sm text-gray-500">Belum ada permintaan booking masuk.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  )
}

function DropdownFilter({
  label, options, open, onToggle, onSelect, selected,
}: {
  label: string
  options: string[]
  open: boolean
  onToggle: () => void
  onSelect: (v: string) => void
  selected: string
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
      >
        {label}
        <ChevronDown className="size-4 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} />
          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-left text-sm',
                  selected === opt ? 'text-emerald-700' : 'text-gray-600 hover:bg-gray-50',
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
