'use client'

import { MessageCircle } from 'lucide-react'

const WHATSAPP_URL =
  'https://wa.me/?text=Halo%20StayPuncak%2C%20saya%20ingin%20tanya%20tentang%20villa.'

export function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat Admin via WhatsApp"
      className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl sm:h-auto sm:w-auto sm:gap-2 sm:px-5 sm:py-3 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="size-6 sm:size-5" />
      <span className="hidden sm:inline sm:text-sm sm:font-semibold">Chat Admin</span>
    </a>
  )
}
