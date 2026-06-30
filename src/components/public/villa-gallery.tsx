'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface VillaGalleryProps {
  images: string[]
  villaName: string
}

export function VillaGallery({ images, villaName }: VillaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="min-w-0 space-y-3 lg:col-span-3">
      <div className="aspect-[16/9] overflow-hidden rounded-xl">
        <img
          src={images[activeIndex]}
          alt={`${villaName} — Foto ${activeIndex + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="hidden gap-3 sm:grid sm:grid-cols-5">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'group relative aspect-[4/3] overflow-hidden rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background',
              activeIndex === i
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-background'
                : 'ring-1 ring-transparent hover:ring-1 hover:ring-white/30',
            )}
          >
            <img
              src={src}
              alt={`${villaName} — Thumbnail ${i + 1}`}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 sm:hidden snap-x snap-mandatory scrollbar-hide">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={cn(
              'snap-start shrink-0 w-24 overflow-hidden rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background',
              activeIndex === i
                ? 'ring-2 ring-brand ring-offset-2 ring-offset-background'
                : 'ring-1 ring-transparent',
            )}
          >
            <div className="aspect-[4/3]">
              <img
                src={src}
                alt={`${villaName} — Thumbnail ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
