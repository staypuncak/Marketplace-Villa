'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  city: string
  text: string
  villaName: string
  avatarColor: string
  className?: string
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function TestimonialCard({
  name,
  city,
  text,
  villaName,
  avatarColor,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg sm:p-8',
        className,
      )}
    >
      <div className="mb-3 flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="flex-1 text-base leading-relaxed text-gray-700">{text}</p>

      <div className="my-5 border-t border-gray-100" />

      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm ring-2 ring-white',
            avatarColor,
          )}
        >
          {getInitials(name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-gray-900">{name}</p>
          <p className="text-xs text-gray-400">{city}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-400">
        Menginap di <span className="font-medium text-brand">{villaName}</span>
      </p>
    </div>
  )
}
