'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sun, Moon, Menu, X, LogIn } from 'lucide-react'
import { useTheme } from '@/lib/theme-context'

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isBlog = pathname.startsWith('/blog')

  const scrollToDiscovery = () => {
    setMobileMenuOpen(false)
    document.getElementById('villa-discovery')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <header
        className={
          isHome
            ? 'absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 py-3 sm:px-8'
            : 'sticky top-0 z-30 flex items-center justify-between border-b border-emerald-800/30 bg-emerald-950/60 shadow-lg shadow-black/30 backdrop-blur-xl px-4 py-3 sm:px-8'
        }
      >
        <div className="flex items-center gap-2">
          <img src="/images/logo-mark.png" alt="StayPuncak" className="h-7 w-auto brightness-0 invert" />
          <span className="text-xl font-bold tracking-tight text-white">
            StayPuncak.com
          </span>
        </div>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm text-white/70 transition-colors hover:text-amber-400 sm:text-base">
            Beranda
          </Link>
          {isHome && (
            <button
              onClick={scrollToDiscovery}
              className="text-sm text-white/70 transition-colors hover:text-amber-400 sm:text-base"
            >
              Daftar Villa
            </button>
          )}
          {!isHome && (
            <Link href="/#villa-discovery" className="text-sm text-white/70 transition-colors hover:text-amber-400 sm:text-base">
              Daftar Villa
            </Link>
          )}
          <Link
            href="/blog"
            className={`text-sm transition-colors sm:text-base ${isBlog ? 'text-amber-400' : 'text-white/70 hover:text-amber-400'}`}
          >
            Blog
          </Link>
          <a href="#" className="text-sm text-white/70 transition-colors hover:text-amber-400 sm:text-base">
            Tentang
          </a>
          <a href="#" className="text-sm text-white/70 transition-colors hover:text-amber-400 sm:text-base">
            Kontak
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="hidden items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white hover:bg-brand/90 sm:flex"
          >
            <LogIn className="size-4" />
            Sign In
          </Link>

          {isHome && (
            <button
              onClick={toggleTheme}
              className="rounded-lg border border-amber-400/50 p-2 text-amber-400"
              aria-label="Toggle day/night mode"
            >
              {theme === 'day' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </button>
          )}

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
        <div
          className={
            isHome
              ? 'absolute inset-x-0 top-14 z-20 mx-4 rounded-lg border border-emerald-800/30 bg-emerald-950/90 p-4 backdrop-blur-xl sm:hidden'
              : 'fixed left-4 right-4 top-16 z-30 rounded-lg border border-emerald-800/30 bg-emerald-950/95 p-4 backdrop-blur-xl sm:hidden'
          }
        >
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-white hover:text-amber-400">
              Beranda
            </Link>
            {isHome ? (
              <button
                onClick={scrollToDiscovery}
                className="text-left text-sm text-white/70 hover:text-amber-400"
              >
                Daftar Villa
              </button>
            ) : (
              <Link
                href="/#villa-discovery"
                className="text-sm text-white/70 hover:text-amber-400"
              >
                Daftar Villa
              </Link>
            )}
            <Link
              href="/blog"
              className={`text-sm ${isBlog ? 'font-medium text-amber-400' : 'text-white/70 hover:text-amber-400'}`}
            >
              Blog
            </Link>
            <a href="#" className="text-sm text-white/70 hover:text-amber-400">
              Tentang
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-amber-400">
              Kontak
            </a>
            <Link
              href="/auth/login"
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-sm font-medium text-white"
            >
              <LogIn className="size-4" />
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
