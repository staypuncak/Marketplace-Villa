'use client'

import { useState, useEffect } from 'react'
import { BadgeCheck, Tag, CheckCircle2, Shield } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { cn } from '@/lib/utils'

const VIDEO_SOURCES = [
  '/Videos/hero_video-bg-01.webp',
  '/Videos/hero_video-bg-02.webp',
  '/Videos/hero_video-bg-03.webp',
]

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEO_SOURCES.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div className="absolute inset-0">
        {VIDEO_SOURCES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-[65%_center] transition-opacity duration-[2000ms] ease-in-out sm:object-center',
              i === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
      </div>

      <Container className="relative z-10 flex min-h-[85vh] flex-col justify-center pb-24 pt-28">
        <div className="max-w-2xl">
          <h1 className="font-serif text-3xl leading-snug tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Booking Villa Puncak
            <br />
            Lebih{' '}
            <span className="text-amber-400">Aman</span>, Lebih{' '}
            <span className="text-amber-400">Hemat</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            Villa terverifikasi, harga transparan, tanpa biaya tambahan, dan didampingi admin
            resmi hingga Anda check-in dengan tenang.
          </p>

          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
            <span className="flex items-center gap-1.5 text-sm text-white/75">
              <BadgeCheck className="size-4 text-amber-400" />
              Villa Terverifikasi
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/75">
              <Tag className="size-4 text-amber-400" />
              Harga Transparan
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/75">
              <CheckCircle2 className="size-4 text-amber-400" />
              Tanpa Biaya Tambahan
            </span>
            <span className="flex items-center gap-1.5 text-sm text-white/75">
              <Shield className="size-4 text-amber-400" />
              Booking Aman
            </span>
          </div>
        </div>
      </Container>
    </section>
  )
}
