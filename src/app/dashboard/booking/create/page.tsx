'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, CheckCircle2, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

type VillaOption = {
  id: string
  name: string
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Booking Baru' },
  { value: 'pending_confirmation', label: 'Menunggu Konfirmasi' },
  { value: 'confirmed', label: 'Dikonfirmasi' },
]

export default function CreateBookingPage() {
  const router = useRouter()
  const supabase = createClient()

  const [villas, setVillas] = useState<VillaOption[]>([])
  const [loadingVillas, setLoadingVillas] = useState(true)

  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [villaId, setVillaId] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guestCount, setGuestCount] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('new')

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [toastError, setToastError] = useState(false)

  useEffect(() => {
    async function fetchVillas() {
      const { data } = await supabase
        .from('villas')
        .select('id, name')
        .eq('status', 'active')
        .order('name')

      setVillas((data ?? []).filter((v) => v.name.trim()))
      setLoadingVillas(false)
    }
    fetchVillas()
  }, [supabase])

  const selectedVilla = villas.find((v) => v.id === villaId)

  function calcNights(): number {
    if (!checkIn || !checkOut) return 1
    const a = new Date(checkIn)
    const b = new Date(checkOut)
    const diff = Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000))
    return diff
  }

  async function handleSave() {
    if (!guestName.trim()) { setToast('Nama tamu wajib diisi'); setToastError(true); return }
    if (!guestPhone.trim()) { setToast('Nomor WhatsApp wajib diisi'); setToastError(true); return }
    if (!villaId) { setToast('Pilih villa terlebih dahulu'); setToastError(true); return }

    setSaving(true)
    setToast(null)

    try {
      const now = new Date().toISOString()
      const nights = calcNights()

      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          villa_id: villaId,
          guest_name: guestName.trim(),
          guest_phone: guestPhone.trim(),
          villa_name: selectedVilla?.name ?? '',
          check_in: checkIn || null,
          check_out: checkOut || null,
          guest_count: Number(guestCount) || null,
          nights,
          notes: notes.trim() || null,
          status,
          source: 'manual_admin',
        })
        .select('id')
        .single()

      if (bookingError) {
        setToast(bookingError.message)
        setToastError(true)
        setSaving(false)
        return
      }

      const phone = guestPhone.trim()
      if (phone && bookingData) {
        const { data: existing } = await supabase
          .from('customers')
          .select('id, name, total_bookings')
          .eq('phone', phone)
          .maybeSingle()

        let customerId: string | null = null

        if (existing) {
          customerId = existing.id
          await supabase
            .from('customers')
            .update({
              name: guestName.trim() || existing.name,
              favorite_villa_id: villaId,
              last_booking_at: now,
              total_bookings: (existing.total_bookings || 0) + 1,
              updated_at: now,
            })
            .eq('id', existing.id)
        } else {
          const { data: newCustomer } = await supabase
            .from('customers')
            .insert({
              name: guestName.trim() || 'Calon Tamu',
              phone,
              favorite_villa_id: villaId,
              last_booking_at: now,
              total_bookings: 1,
              status: 'active',
            })
            .select('id')
            .single()

          if (newCustomer) customerId = newCustomer.id
        }

        if (customerId) {
          await supabase
            .from('bookings')
            .update({ customer_id: customerId })
            .eq('id', bookingData.id)
        }
      }

      setToast('Booking berhasil dicatat')
      setToastError(false)
      setTimeout(() => router.push('/dashboard/booking'), 1200)
    } catch {
      setToast('Gagal menyimpan booking')
      setToastError(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <Link
        href="/dashboard/booking"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft className="size-4" /> Kembali ke Booking
      </Link>

      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Catat Booking Manual</h2>
        <p className="mt-1 text-sm text-gray-500">
          Untuk booking yang masuk lewat WhatsApp, telepon, atau tamu langsung.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nama Tamu *</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="contoh: Budi Santoso"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nomor WhatsApp *</label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="6281234567890"
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Villa *</label>
          {loadingVillas ? (
            <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-400">
              <Loader2 className="size-4 animate-spin" /> Memuat villa...
            </div>
          ) : (
            <select
              value={villaId}
              onChange={(e) => setVillaId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Pilih villa</option>
              {villas.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Check-in</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Check-out</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {checkIn && checkOut && (
          <p className="text-xs text-gray-400">
            {calcNights()} malam menginap
          </p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Jumlah Tamu</label>
            <input
              type="number"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Informasi tambahan..."
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="size-4 animate-spin" /> Menyimpan...</>
          ) : (
            'Catat Booking'
          )}
        </button>
      </div>

      {toast && (
        <div
          className={cn(
            'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-lg',
            toastError ? 'bg-red-600' : 'bg-emerald-600',
          )}
        >
          {toastError ? <X className="size-5 shrink-0" /> : <CheckCircle2 className="size-5 shrink-0" />}
          {toast}
          <button onClick={() => setToast(null)} className="ml-2">
            <X className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
