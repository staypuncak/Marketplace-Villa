'use client'

import { useState, useEffect } from 'react'
import { BadgeCheck, Tag, CheckCircle2, Shield } from 'lucide-react'
import { Container } from '@/components/shared/container'
import { cn } from '@/lib/utils'

const VIDEOS = [
  { src: '/Videos/video-bg-01.mp4', poster: '/Videos/hero_video-bg-01.webp' },
  { src: '/Videos/video-bg-02.mp4', poster: '/Videos/hero_video-bg-02.webp' },
  { src: '/Videos/video-bg-03.mp4', poster: '/Videos/hero_video-bg-03.webp' },
]

type HeroSettings = {
  eyebrow: string
  headline: string
  subheadline: string
}

function parseHeadline(headline: string): { before: string; highlight: string; after: string } {
  const parts = headline.split(/(.*?)(Lebih \w+,? Lebih \w+\.?)/)
  if (parts.length >= 4) {
    return { before: parts[1] || '', highlight: parts[2] || '', after: parts[3] || '' }
  }
  return { before: headline, highlight: '', after: '' }
}

export function HeroSection({ settings }: { settings: HeroSettings }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % VIDEOS.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const { before, highlight, after } = parseHeadline(settings.headline)

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      <div className="absolute inset-0">
        {VIDEOS.map((video, i) => (
          <video
            key={video.src}
            src={video.src}
            poster={video.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className={cn(
              'absolute inset-0 h-full w-full object-cover object-[65%_center] transition-opacity duration-[2000ms] ease-in-out sm:object-center',
              i === activeIndex ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
      </div>

      <Container className="relative z-10 flex min-h-[85vh] flex-col justify-center pb-24 pt-28">
        <div className="-mt-4 max-w-2xl sm:mt-0">
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-amber-400 sm:mb-3 sm:text-xs">
            {settings.eyebrow}
          </p>
          <h1 className="font-serif text-[2rem] leading-[1.45] sm:leading-snug tracking-tighter text-white sm:text-5xl lg:text-6xl">
            {before}
            {highlight && (
              <>
                <br />
                <span className="text-amber-400">{highlight}</span>
              </>
            )}
            {after}
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            {settings.subheadline}
          </p>

          <div className="mt-[84px] flex flex-wrap gap-x-6 gap-y-2 sm:mt-12">
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
