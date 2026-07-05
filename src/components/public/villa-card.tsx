import Link from 'next/link'
import { Users, Bed, Bath, MapPin, Star, ChevronRight } from 'lucide-react'
import type { Villa } from '@/types/villa'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

function getBadge(name: string): string {
  const map: Record<string, string> = {
    'Villa Puncak Indah': 'Private Pool',
    'Villa Bukit Respati': 'Family Favorite',
    'Villa Cloud Nine': 'Best View',
    'Villa Alam Asri': 'Near Taman Safari',
    'Villa Mountain View': 'Villa Premium',
  }
  return map[name] ?? 'Villa Premium'
}

function estimateBedrooms(capacity: number): number {
  if (capacity <= 4) return 2
  if (capacity <= 8) return 3
  if (capacity <= 12) return 4
  if (capacity <= 16) return 6
  return 8
}

function estimateBathrooms(capacity: number): number {
  if (capacity <= 2) return 1
  if (capacity <= 6) return 2
  if (capacity <= 12) return 3
  return 4
}

type VillaCardProps = {
  villa: Villa
}

export function VillaCard({ villa }: VillaCardProps) {
  const bedrooms = estimateBedrooms(villa.capacity)
  const bathrooms = estimateBathrooms(villa.capacity)
  const badge = getBadge(villa.name)

  return (
    <Link href={`/villa/${villa.slug}`} className="group block h-full focus-visible:outline-none">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-100/50 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-emerald-100 to-emerald-200">
          <img
            src={villa.thumbnailImage}
            alt={villa.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          />

          <div className="absolute left-3 top-3 z-10 rounded-full bg-emerald-950/70 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {badge}
          </div>

          <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-amber-600 shadow-sm backdrop-blur-sm">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            <span>4.9</span>
            <span className="text-muted-foreground">(128)</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4 pt-3.5">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight">
            {villa.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-1 text-xs text-emerald-700">
            <MapPin className="size-3" />
            <span>{villa.location}</span>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {villa.capacity}
            </span>
            <span className="flex items-center gap-1">
              <Bed className="size-3.5" />
              {bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="size-3.5" />
              {bathrooms}
            </span>
          </div>

          <div className="mt-auto pt-4">
            <div className="mb-3">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Mulai dari
              </p>
              <p className="text-xl font-bold text-brand">
                {formatPrice(villa.price)}
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  /malam
                </span>
              </p>
            </div>

            <div className="flex items-center gap-1 text-sm font-medium text-brand transition-all duration-200 group-hover:gap-2">
              Lihat Detail
              <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
