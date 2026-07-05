'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Building, Users, Phone, Mail,
  Copy, ExternalLink, CheckCircle2, X, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Tables } from '@/lib/supabase/types'

type BookingRow = Tables<'bookings'>
type VillaRow = Tables<'villas'>

type BookingStatus = 'baru' | 'menunggu' | 'confirmed' | 'checkin' | 'completed' | 'cancelled'

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
}

const localStatusToDb: Record<BookingStatus, string> = {
  baru: 'new',
  menunggu: 'pending_confirmation',
  confirmed: 'confirmed',
  checkin: 'checked_in',
  completed: 'completed',
  cancelled: 'cancelled',
}

const statusTransitions: { status: BookingStatus; label: string; color: string }[] = [
  { status: 'menunggu', label: 'Tandai Menunggu Konfirmasi', color: 'bg-amber-600 hover:bg-amber-700' },
  { status: 'confirmed', label: 'Tandai Dikonfirmasi', color: 'bg-emerald-600 hover:bg-emerald-700' },
  { status: 'checkin', label: 'Tandai Check-in', color: 'bg-purple-600 hover:bg-purple-700' },
  { status: 'completed', label: 'Tandai Selesai', color: 'bg-gray-600 hover:bg-gray-700' },
]

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
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-3 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
      <CheckCircle2 className="size-5 shrink-0" />
      {message}
    </div>
  )
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const supabase = createClient()

  const [booking, setBooking] = useState<BookingRow | null>(null)
  const [villa, setVilla] = useState<Pick<VillaRow, 'slug' | 'name' | 'location'> | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*')
          .eq('id', id)
          .single()

        if (cancelled) return
        if (bookingError || !bookingData) {
          return
        }

        setBooking(bookingData)

        if (bookingData.villa_id) {
          const { data: villaData } = await supabase
            .from('villas')
            .select('slug, name, location')
            .eq('id', bookingData.villa_id)
            .single()

          if (!cancelled && villaData) {
            setVilla(villaData)
          }
        }
      } catch (err) {
        if (!cancelled) console.error('Failed to fetch booking:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [id, supabase])

  async function updateStatus(newStatus: BookingStatus) {
    if (!booking) return
    setUpdating(true)
    try {
      const dbStatus = localStatusToDb[newStatus]
      const { error } = await supabase
        .from('bookings')
        .update({ status: dbStatus, updated_at: new Date().toISOString() })
        .eq('id', booking.id)

      if (error) throw error

      setBooking({ ...booking, status: dbStatus as BookingRow['status'] })
      setToast('Status booking berhasil diperbarui')
    } catch (err) {
      console.error('Status update error:', err)
      setToast('Gagal memperbarui status')
    } finally {
      setUpdating(false)
    }
  }

  async function handleCancel() {
    if (!booking) return
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', booking.id)

      if (error) throw error

      setBooking({ ...booking, status: 'cancelled' as BookingRow['status'] })
      setToast('Booking berhasil dibatalkan')
    } catch (err) {
      console.error('Cancel error:', err)
      setToast('Gagal membatalkan booking')
    } finally {
      setUpdating(false)
    }
  }

  const handleCopy = async () => {
    if (!booking?.whatsapp_message) return
    try {
      await navigator.clipboard.writeText(booking.whatsapp_message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-gray-500">Booking tidak ditemukan.</p>
        <Link href="/dashboard/booking" className="mt-2 text-sm text-emerald-600 hover:underline">
          ← Kembali ke Booking
        </Link>
      </div>
    )
  }

  const localStatus = dbStatusToLocal[booking.status] || 'baru'
  const status = statusConfig[localStatus]
  const waUrl = booking.whatsapp_message
    ? `https://wa.me/${booking.guest_phone || ''}?text=${encodeURIComponent(booking.whatsapp_message)}`
    : null
  const canCancel = localStatus !== 'cancelled' && localStatus !== 'completed'

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/booking"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft className="size-4" />
        Kembali ke Booking
      </Link>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Detail Booking</h2>
        <p className="mt-1 text-sm text-gray-500">
          Kelola informasi dan status booking calon tamu.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Informasi Booking</h3>
              <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', status.class)}>
                {status.label}
              </span>
            </div>

            <div className="mt-4 divide-y divide-gray-100">
              <InfoRow label="Booking ID" value={<span className="font-mono text-xs">#{booking.id.slice(0, 8)}</span>} />
              <InfoRow label="Dibuat" value={timeAgo(booking.created_at)} />
              <InfoRow
                label="Villa"
                value={
                  villa ? (
                    <span className="flex items-center gap-1.5">
                      <Building className="size-4 text-gray-400" />
                      {villa.name}
                    </span>
                  ) : (
                    booking.villa_name || '—'
                  )
                }
              />
              <InfoRow label="Check-in" value={formatDate(booking.check_in)} />
              <InfoRow label="Check-out" value={formatDate(booking.check_out)} />
              <InfoRow
                label="Malam"
                value={
                  booking.nights
                    ? `${booking.nights} malam`
                    : booking.check_in && booking.check_out
                      ? `${Math.ceil((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / (1000 * 3600 * 24))} malam`
                      : '—'
                }
              />
              <InfoRow
                label="Tamu"
                value={
                  <span className="flex items-center gap-1.5">
                    <Users className="size-4 text-gray-400" />
                    {booking.guest_count ? `${booking.guest_count} orang` : '—'}
                  </span>
                }
              />
              <InfoRow
                label="Nama Tamu"
                value={booking.guest_name || <span className="italic text-gray-400">Calon Tamu</span>}
              />
              {booking.guest_phone && (
                <InfoRow
                  label="No. Telepon"
                  value={
                    <a href={`tel:${booking.guest_phone}`} className="flex items-center gap-1.5 text-emerald-600 hover:underline">
                      <Phone className="size-4" />
                      {booking.guest_phone}
                    </a>
                  }
                />
              )}
              {booking.guest_email && (
                <InfoRow
                  label="Email"
                  value={
                    <a href={`mailto:${booking.guest_email}`} className="flex items-center gap-1.5 text-emerald-600 hover:underline">
                      <Mail className="size-4" />
                      {booking.guest_email}
                    </a>
                  }
                />
              )}
              <InfoRow
                label="Sumber"
                value={booking.source || 'website'}
              />
              {booking.notes && (
                <InfoRow label="Catatan" value={booking.notes} />
              )}
            </div>
          </div>

          {booking.whatsapp_message && (
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-900">Pesan WhatsApp</h3>
              <div className="mt-3 rounded-lg bg-gray-50 p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {booking.whatsapp_message}
                </pre>
              </div>
              <button
                onClick={handleCopy}
                className="mt-3 flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-4" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Salin Pesan
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Status & Aksi</h3>

            <div className="mt-4 space-y-2">
              {statusTransitions.map(({ status: s, label, color }) => {
                const isCurrent = localStatus === s
                const isPast = statusTransitions.findIndex((t) => t.status === localStatus) >= statusTransitions.findIndex((t) => t.status === s)

                if (isPast && !isCurrent) return null

                return (
                  <button
                    key={s}
                    onClick={() => updateStatus(s)}
                    disabled={updating || isCurrent || localStatus === 'cancelled'}
                    className={cn(
                      'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50',
                      isCurrent ? 'ring-2 ring-gray-300 ring-offset-2 opacity-70 cursor-default' : color,
                    )}
                  >
                    {updating && <Loader2 className="size-4 animate-spin" />}
                    {isCurrent ? `✓ ${label}` : label}
                  </button>
                )
              })}
            </div>

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={updating}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-50 disabled:opacity-50"
              >
                <X className="size-4" />
                Batalkan Booking
              </button>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">Tautan Cepat</h3>
            <div className="mt-3 space-y-2">
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  <ExternalLink className="size-4" />
                  Buka WhatsApp
                </a>
              )}
              <button
                onClick={handleCopy}
                className="flex w-full items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="size-4" />
                    Salin Pesan WhatsApp
                  </>
                )}
              </button>
              {villa?.slug && (
                <Link
                  href={`/villa/${villa.slug}`}
                  target="_blank"
                  className="flex items-center gap-2.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                >
                  <ExternalLink className="size-4" />
                  Lihat Villa
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}
