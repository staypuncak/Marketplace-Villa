'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const WHATSAPP_URL =
  'https://wa.me/?text=Halo%20StayPuncak%2C%20saya%20ingin%20tanya%20tentang%20villa.'

export function WhatsAppFloat() {
  const [atFooter, setAtFooter] = useState(false)

  useEffect(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const observer = new IntersectionObserver(
      ([entry]) => setAtFooter(entry.isIntersecting),
      { threshold: 0.1 },
    )
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Admin via WhatsApp"
      className={cn(
        'group fixed z-50 flex items-center justify-center overflow-hidden rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl',
        'bottom-5 right-5 h-14 w-14',
        'sm:bottom-8 sm:right-8 sm:h-12 sm:w-12 sm:justify-start sm:pl-3.5 sm:hover:w-[150px]',
        atFooter && 'sm:bottom-[60px]',
      )}
    >
      <MessageCircle className="size-6 shrink-0 sm:size-5" />
      <span className="hidden whitespace-nowrap pl-2 text-sm font-semibold opacity-0 transition-all duration-300 sm:inline-block sm:max-w-0 sm:group-hover:max-w-[90px] sm:group-hover:opacity-100">
        Chat Admin
      </span>
    </a>
  )
}
