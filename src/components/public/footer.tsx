'use client'

import Link from 'next/link'
import { BadgeCheck, Tag, MessageCircle, Phone, Mail, MapPin } from 'lucide-react'
import { Container } from '@/components/shared/container'

function scrollToDiscovery() {
  document.getElementById('villa-discovery')?.scrollIntoView({ behavior: 'smooth' })
}

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Daftar Villa', action: scrollToDiscovery },
  { label: 'Blog', href: '#' },
  { label: 'Tentang', href: '#' },
  { label: 'Kontak', href: '#' },
]

const trustItems = [
  { icon: BadgeCheck, text: 'Villa Terverifikasi' },
  { icon: Tag, text: 'Harga Fix tanpa extra charge' },
  { icon: MessageCircle, text: 'Booking mudah via WhatsApp' },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="size-5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.18V11.2a4.85 4.85 0 01-5.58-2.36V6.69h5.58z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-black text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <span className="text-xl font-bold tracking-tight text-white">
              StayPuncak.com
            </span>
            <p className="text-sm leading-relaxed text-white/60">
              Villa pilihan keluarga di Puncak Bogor.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="text-white/40 transition-colors hover:text-amber-400">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="TikTok" className="text-white/40 transition-colors hover:text-amber-400">
                <TikTokIcon />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/40 transition-colors hover:text-amber-400">
                <FacebookIcon />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Navigasi
            </h3>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) =>
                link.href ? (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="text-left text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                )
              )}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Kontak
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="size-4 shrink-0 text-amber-400" />
                +62 812-3456-7890
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Mail className="size-4 shrink-0 text-amber-400" />
                info@staypuncak.com
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="size-4 shrink-0 text-amber-400" />
                Puncak Bogor
              </li>
            </ul>
          </div>

          {/* Trust */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Kepercayaan
            </h3>
            <ul className="flex flex-col gap-2.5">
              {trustItems.map((item) => (
                <li key={item.text} className="flex items-center gap-2 text-sm text-white/60">
                  <item.icon className="size-4 shrink-0 text-amber-400" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <Container className="py-5">
          <p className="text-center text-xs text-white/40">
            &copy; 2026 StayPuncak.com. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  )
}
