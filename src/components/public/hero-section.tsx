'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sun, Moon, Menu, X, BadgeCheck, Tag, MessageCircle, ArrowDown } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { cn } from '@/lib/utils'

type Theme = 'day' | 'night'

export function HeroSection() {
  const [theme, setTheme] = useState<Theme>('day')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'day' ? 'night' : 'day'))
  }

  const scrollToDiscovery = () => {
    setMobileMenuOpen(false)
    document.getElementById('villa-discovery')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-8">
        <span className="text-xl font-bold tracking-tight text-white">
          StayPuncak.com
        </span>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm font-medium text-white">
            Beranda
          </Link>
          <button
            onClick={scrollToDiscovery}
            className="text-sm text-white/70 hover:text-white"
          >
            Daftar Villa
          </button>
          <a href="#" className="text-sm text-white/70 hover:text-white">
            Blog
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-white">
            Tentang
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-white">
            Kontak
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand/90 sm:flex"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-white/30 p-2 text-white/70 hover:text-white"
            aria-label="Toggle day/night mode"
          >
            {theme === 'day' ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white sm:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-14 z-20 mx-4 rounded-lg border border-white/10 bg-black/80 p-4 backdrop-blur-md sm:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-white">
              Beranda
            </Link>
            <button
              onClick={scrollToDiscovery}
              className="text-left text-sm text-white/70 hover:text-white"
            >
              Daftar Villa
            </button>
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Blog
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Tentang
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Kontak
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
            >
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </nav>
        </div>
      )}

      <section className="relative min-h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/Background-staypuncak-day.png"
            alt=""
            className={cn(
              'h-full w-full object-cover transition-opacity duration-700',
              theme === 'day' ? 'opacity-100' : 'opacity-0',
            )}
          />
          <img
            src="/images/Background-staypuncak-night.png"
            alt=""
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
              theme === 'night' ? 'opacity-100' : 'opacity-0',
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />
        </div>

        <Container className="relative z-10 flex min-h-[85vh] flex-col justify-center pb-20 pt-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Villa Puncak,
              <br />
              Liburan Berkesan untuk Anda dan Keluarga Tercinta
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/80">
              Jelajahi pilihan villa di Puncak untuk keluarga, rombongan, hingga gathering. Temukan
              pengalaman liburan yang berkesan, cek ketersediaan, dan booking langsung melalui
              WhatsApp.
            </p>
            <button
              onClick={scrollToDiscovery}
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand/90"
            >
              Jelajahi Villa
              <ArrowDown className="size-4" />
            </button>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <BadgeCheck className="size-5 shrink-0 text-brand" />
                Villa Terverifikasi — Guaranteed Safe
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Tag className="size-5 shrink-0 text-brand" />
                Harga Fix — Tanpa Extra Charge
              </div>
              <div className="flex items-center gap-2 text-sm text-white/80">
                <MessageCircle className="size-5 shrink-0 text-brand" />
                Booking Mudah — Langsung via WhatsApp
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
