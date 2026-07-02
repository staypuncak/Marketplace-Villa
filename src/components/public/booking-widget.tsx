'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  villaName: string
  villaLocation: string
}

export function BookingWidget({ villaName, villaLocation }: BookingWidgetProps) {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

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

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Booking
      </h2>
      <div className="grid gap-3">
        <div>
          <label htmlFor="check-in" className="mb-1 block text-sm font-medium">
            Check-in
          </label>
          <input
            id="check-in"
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            placeholder="Pilih Tanggal"
            className="w-full rounded-xl border border-emerald-200 bg-background px-3 py-2 text-sm accent-emerald-700 shadow-sm outline-none focus-visible:border-emerald-600 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
          />
        </div>
        <div>
          <label htmlFor="check-out" className="mb-1 block text-sm font-medium">
            Check-out
          </label>
          <input
            id="check-out"
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || undefined}
            placeholder="Pilih Tanggal"
            className="w-full rounded-xl border border-emerald-200 bg-background px-3 py-2 text-sm accent-emerald-700 shadow-sm outline-none focus-visible:border-emerald-600 focus-visible:ring-3 focus-visible:ring-emerald-500/20"
          />
        </div>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: 'default' }), 'flex w-full items-center justify-center gap-2 py-3 text-base min-h-12')}
      >
        <MessageCircle className="size-5" />
        Booking via WhatsApp
      </a>
    </div>
  )
}
