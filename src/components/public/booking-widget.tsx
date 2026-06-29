'use client'

import { useState } from 'react'
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
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
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
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
      >
        Booking via WhatsApp
      </a>
    </div>
  )
}
