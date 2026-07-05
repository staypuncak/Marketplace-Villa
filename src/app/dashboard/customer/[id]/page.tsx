'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Building, Phone, Mail,
  MessageCircle, ExternalLink, Edit3, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type CustomerRow = Tables<'customers'>
type BookingRow = Tables<'bookings'>
type VillaRow = Tables<'villas'>

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
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: 'Aktif', class: 'bg-emerald-100 text-emerald-700' },
  vip: { label: 'VIP', class: 'bg-amber-100 text-amber-700' },
  inactive: { label: 'Tidak Aktif', class: 'bg-gray-100 text-gray-500' },
}

const bookingStatusConfig: Record<string, { label: string; class: string }> = {
  new: { label: 'Baru', class: 'bg-blue-100 text-blue-700' },
  pending_confirmation: { label: 'Menunggu', class: 'bg-amber-100 text-amber-700' },
  confirmed: { label: 'Dikonfirmasi', class: 'bg-emerald-100 text-emerald-700' },
  checked_in: { label: 'Check-in', class: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Selesai', class: 'bg-gray-100 text-gray-500' },
  cancelled: { label: 'Dibatalkan', class: 'bg-red-100 text-red-600' },
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()

  const [customer, setCustomer] = useState<CustomerRow | null>(null)
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [favoriteVilla, setFavoriteVilla] = useState<Pick<VillaRow, 'name' | 'slug'> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single()

        if (cancelled) return
        if (customerError || !customerData) return

        setCustomer(customerData)

        if (customerData.favorite_villa_id) {
          const { data: villaData } = await supabase
            .from('villas')
            .select('name, slug')
            .eq('id', customerData.favorite_villa_id)
            .single()

          if (!cancelled && villaData) {
            setFavoriteVilla(villaData)
          }
        }

        const { data: bookingData } = await supabase
          .from('bookings')
          .select('*')
          .eq('customer_id', customerData.id)
          .order('created_at', { ascending: false })

        if (!cancelled && bookingData) {
          setBookings(bookingData)
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch customer:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [id, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Customer tidak ditemukan.</p>
        <Link href="/dashboard/customer" className="mt-2 text-sm text-emerald-600 hover:underline">
          ← Kembali ke Customer
        </Link>
      </div>
    )
  }

  const status = statusConfig[customer.status] || statusConfig.active
  const waUrl = customer.phone
    ? `https://wa.me/${customer.phone}`
    : null

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/customer"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Customer
      </Link>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                {initials(customer.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-900">{customer.name}</h3>
                  <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', status.class)}>
                    {status.label}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  {customer.phone && (
                    <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-emerald-600 hover:underline">
                      <Phone className="size-3.5" />
                      {customer.phone}
                    </a>
                  )}
                  {customer.email && (
                    <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-emerald-600 hover:underline">
                      <Mail className="size-3.5" />
                      {customer.email}
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{customer.total_bookings}</p>
                <p className="text-xs text-gray-500">Total Booking</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{formatDate(customer.last_booking_at)}</p>
                <p className="text-xs text-gray-500">Terakhir Booking</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-lg font-semibold text-gray-900">{formatDate(customer.created_at)}</p>
                <p className="text-xs text-gray-500">Customer Sejak</p>
              </div>
            </div>

            {favoriteVilla && (
              <div className="mt-4 rounded-lg bg-amber-50 p-3">
                <p className="text-xs font-medium text-amber-600">Villa Favorit</p>
                <Link
                  href={`/villa/${favoriteVilla.slug}`}
                  target="_blank"
                  className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:underline"
                >
                  <Building className="size-4" />
                  {favoriteVilla.name}
                  <ExternalLink className="size-3" />
                </Link>
              </div>
            )}

            {customer.notes && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500">Catatan</p>
                <p className="mt-1 text-sm text-gray-700">{customer.notes}</p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Riwayat Booking</h3>
            {bookings.length === 0 ? (
              <p className="mt-3 text-sm text-gray-400">Belum ada riwayat booking.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {bookings.map((booking) => {
                  const bStatus = bookingStatusConfig[booking.status] || { label: booking.status, class: 'bg-gray-100 text-gray-500' }
                  return (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {booking.villa_name || 'Villa'}
                          </p>
                          <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', bStatus.class)}>
                            {bStatus.label}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-gray-400">
                          {formatDate(booking.check_in)} — {formatDate(booking.check_out)}
                          {booking.nights ? ` · ${booking.nights} malam` : ''}
                        </p>
                      </div>
                      <Link
                        href={`/dashboard/booking/${booking.id}`}
                        className="shrink-0 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Aksi Cepat</h3>
            <div className="mt-3 space-y-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  <MessageCircle className="size-4" />
                  Buka WhatsApp
                </a>
              )}
              <button
                disabled
                className="flex w-full items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 shadow-sm"
              >
                <Edit3 className="size-4" />
                Buat Booking (Segera)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
