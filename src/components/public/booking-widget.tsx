'use client'

import { useState } from 'react'
import { Calendar, MessageCircle } from 'lucide-react'
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
  const displayValue = value ? formatDateIndonesian(value) : ''

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <div className="pointer-events-none flex w-full items-center rounded-xl border border-emerald-200 bg-background px-3 py-2.5 pl-10 text-sm shadow-sm">
          {displayValue || <span className="text-muted-foreground">Pilih Tanggal</span>}
        </div>
        <Calendar className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-600" />
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full cursor-pointer opacity-0"
        />
      </div>
    </div>
  )
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
