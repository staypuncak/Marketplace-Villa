import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/shared/container'
import { BookingWidget } from '@/components/public/booking-widget'
import { villas, getVillaBySlug } from '@/data/villas'
import type { Metadata } from 'next'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function generateStaticParams() {
  return villas.map((villa) => ({ slug: villa.slug }))
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const villa = getVillaBySlug(slug)

  if (!villa) return {}

  return {
    title: villa.name,
    description: villa.description,
  }
}

export default async function VillaDetailPage({ params }: Props) {
  const { slug } = await params
  const villa = getVillaBySlug(slug)

  if (!villa) {
    notFound()
  }

  return (
    <Container className="py-8">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        &larr; Kembali
      </Link>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="aspect-[16/9] rounded-xl bg-muted lg:col-span-3" />

        <div className="flex flex-col gap-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {villa.name}
            </h1>
            <p className="mt-1 text-muted-foreground">{villa.location}</p>
          </div>

          <p className="leading-relaxed text-muted-foreground">
            {villa.description}
          </p>

          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-brand">
              {formatPrice(villa.price)}
            </span>
            <span className="text-muted-foreground">/malam</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Kapasitas:</span>
            <span className="font-medium text-foreground">
              {villa.capacity} tamu
            </span>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Fasilitas
            </h2>
            <div className="flex flex-wrap gap-2">
              {villa.facilities.map((facility) => (
                <span
                  key={facility}
                  className="rounded-full border bg-muted/50 px-3 py-1 text-sm"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>

          <BookingWidget
            villaName={villa.name}
            villaLocation={villa.location}
          />
        </div>
      </div>
    </Container>
  )
}
