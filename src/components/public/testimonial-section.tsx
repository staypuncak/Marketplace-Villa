'use client'

import { useState, useRef, useCallback } from 'react'
import { Container } from '@/components/shared/container'
import { Star } from 'lucide-react'
import { TestimonialCard } from './testimonial-card'
import { testimonials } from '@/data/testimonials'

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const startX = useRef(0)
  const isSwiping = useRef(false)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    isSwiping.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (Math.abs(e.touches[0].clientX - startX.current) > 10) {
      isSwiping.current = true
    }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isSwiping.current) return
      const diff = e.changedTouches[0].clientX - startX.current
      if (Math.abs(diff) < 50) return

      if (diff < 0 && currentIndex < testimonials.length - 1) {
        setCurrentIndex((prev) => prev + 1)
      } else if (diff > 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
      }
    },
    [currentIndex],
  )

  return (
    <section className="bg-[#F6F8F6] py-16 sm:py-24">
      <Container>
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm text-amber-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1.5 font-medium">Dipercaya Banyak Tamu</span>
          </div>

          <h2 className="font-serif text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Apa Kata Mereka
          </h2>
          <p className="mt-3 text-base text-gray-500 sm:text-lg">
            Dipercaya oleh keluarga, rombongan, dan perusahaan yang menikmati liburan di Puncak
            bersama StayPuncak.
          </p>
        </div>

        <div className="hidden gap-6 sm:grid sm:grid-cols-3">
          {testimonials.slice(0, 3).map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>

        <div className="sm:hidden">
          <div
            className="flex touch-pan-y"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((t) => (
              <div key={t.id} className="w-full shrink-0 px-4 transition-transform duration-300">
                <TestimonialCard {...t} />
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-brand' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
