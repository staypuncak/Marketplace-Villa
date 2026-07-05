'use client'

import { useState, useCallback } from 'react'
import { Calendar, MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

function formatDateIndonesian(dateString: string): string {
  try {
    const date = new Date(dateString + 'T00:00:00')
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}

type BookingWidgetProps = {
  villaId: string
  villaName: string
  villaLocation: string
}

function DateField({
  label,
  id,
  value,
  min,
  onChange,
}: {
  label: string
  id: string
  value: string
  min?: string
  onChange: (value: string) => void
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-emerald-200 bg-background px-3 py-2.5 pl-10 text-sm shadow-sm outline-none focus-visible:border-emerald-600 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
        />
        {!value && (
          <span className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            Pilih Tanggal
          </span>
        )}
        <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600" />
      </div>
    </div>
  )
}

export function BookingWidget({ villaId, villaName, villaLocation }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [saving, setSaving] = useState(false)

  const parts = [
    `Halo Admin StayPuncak 👋`,
    '',
    'Saya tertarik untuk booking villa berikut:',
    '',
    `🏡 Villa\n${villaName}`,
    '',
    `📍 Lokasi\n${villaLocation}`,
  ]

  if (checkIn) {
    parts.push('', `📅 Check-in\n${formatDateIndonesian(checkIn)}`)
  }

  if (checkOut) {
    parts.push('', `📅 Check-out\n${formatDateIndonesian(checkOut)}`)
  }

  parts.push(
    '',
    'Mohon informasi mengenai:',
    '',
    '• Ketersediaan villa',
    '• Total biaya',
    '• Cara pembayaran',
    '',
    'Terima kasih.',
  )

  const message = parts.join('\n')

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`

  const handleBook = useCallback(async () => {
    setSaving(true)
    const supabase = createClient()
    const nights = checkIn && checkOut
      ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 3600 * 24)))
      : null

    try {
      await supabase
        .from('bookings')
        .insert({
          villa_id: villaId,
          villa_name: villaName,
          check_in: checkIn,
          check_out: checkOut,
          nights,
          whatsapp_message: message,
          source: 'website',
          status: 'new',
        })
    } catch (err) {
      console.error('Failed to save booking lead:', err)
    }

    window.open(whatsappUrl, '_blank', 'noopener')
    setSaving(false)
  }, [villaId, villaName, checkIn, checkOut, message, whatsappUrl])

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Booking
      </h2>
      <div className="grid gap-3">
        <DateField
          label="Check-in"
          id="check-in"
          value={checkIn}
          onChange={setCheckIn}
        />
        <DateField
          label="Check-out"
          id="check-out"
          value={checkOut}
          min={checkIn || undefined}
          onChange={setCheckOut}
        />
      </div>
      <button
        onClick={handleBook}
        disabled={saving}
        className={cn(buttonVariants({ variant: 'default' }), 'flex w-full items-center justify-center gap-2 py-3 text-base min-h-12')}
      >
        <MessageCircle className="size-5" />
        {saving ? 'Memproses...' : 'Booking via WhatsApp'}
      </button>
    </div>
  )
}
