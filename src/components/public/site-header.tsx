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
            : 'sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black px-4 py-3 sm:px-8'
        }
      >
        <span className="text-xl font-bold tracking-tight text-white">
          StayPuncak.com
        </span>

        <nav className="hidden items-center gap-6 sm:flex">
          <Link href="/" className="text-sm text-white/70 hover:text-white sm:text-base">
            Beranda
          </Link>
          {isHome && (
            <button
              onClick={scrollToDiscovery}
              className="text-sm text-white/70 hover:text-white sm:text-base"
            >
              Daftar Villa
            </button>
          )}
          {!isHome && (
            <Link href="/#villa-discovery" className="text-sm text-white/70 hover:text-white sm:text-base">
              Daftar Villa
            </Link>
          )}
          <a href="#" className="text-sm text-white/70 hover:text-white sm:text-base">
            Blog
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-white sm:text-base">
            Tentang
          </a>
          <a href="#" className="text-sm text-white/70 hover:text-white sm:text-base">
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

          <button
            onClick={toggleTheme}
            className="rounded-lg border border-amber-400/50 p-2 text-amber-400"
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
        <div
          className={
            isHome
              ? 'absolute inset-x-0 top-14 z-20 mx-4 rounded-lg border border-white/10 bg-black/80 p-4 backdrop-blur-md sm:hidden'
              : 'fixed left-4 right-4 top-16 z-30 rounded-lg border border-white/10 bg-black/95 p-4 backdrop-blur-md sm:hidden'
          }
        >
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm font-medium text-white">
              Beranda
            </Link>
            {isHome ? (
              <button
                onClick={scrollToDiscovery}
                className="text-left text-sm text-white/70 hover:text-white"
              >
                Daftar Villa
              </button>
            ) : (
              <Link
                href="/#villa-discovery"
                className="text-sm text-white/70 hover:text-white"
              >
                Daftar Villa
              </Link>
            )}
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Blog
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-white">
              Tentang
            </a>
            <a href="#" className="text-sm text-white/70 hover:text-white">
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
