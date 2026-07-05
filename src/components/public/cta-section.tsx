'use client'

import { MessageCircle } from 'lucide-react'
import { Container } from '@/components/shared/container'

type FinalCtaSettings = {
  eyebrow: string
  headline: string
  subheadline: string
  primaryButton: string
  secondaryButton: string
}

export function CtaSection({ settings, whatsappNumber, whatsappMessage }: { settings: FinalCtaSettings; whatsappNumber: string; whatsappMessage: string }) {
  const scrollToDiscovery = () => {
    document.getElementById('villa-discovery')?.scrollIntoView({ behavior: 'smooth' })
  }

  const target = whatsappNumber || ''
  const message = whatsappMessage || 'Halo StayPuncak, saya ingin tanya tentang villa.'
  const whatsappUrl = `https://wa.me/${target}?text=${encodeURIComponent(message)}`

  const lines = settings.headline.split('\n')

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d1f0d] via-[#162b16] to-[#0a1a0a] py-20 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-sm">
            {settings.eyebrow}
          </p>

          <h2 className="font-serif text-3xl font-medium leading-tight tracking-tight text-white sm:text-5xl">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            {settings.subheadline}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {whatsappNumber && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-white shadow-lg shadow-brand/30 transition-all duration-300 hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/40 sm:w-auto"
              >
                <MessageCircle className="size-5" />
                {settings.primaryButton}
              </a>
            )}
            <button
              onClick={scrollToDiscovery}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/20 px-8 py-4 text-base font-semibold text-white/90 transition-all duration-300 hover:border-white/40 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              {settings.secondaryButton}
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
