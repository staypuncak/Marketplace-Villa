import { Container } from '@/components/shared/container'
import { VillaCard } from '@/components/public/villa-card'
import { HeroSection } from '@/components/public/hero-section'
import { SearchCard } from '@/components/public/search-card'
import { TestimonialSection } from '@/components/public/testimonial-section'
import { CtaSection } from '@/components/public/cta-section'
import { getAllVillas, getLocations } from '@/lib/supabase/queries'

type Props = {
  searchParams: Promise<{ q?: string; location?: string; capacity?: string; sort?: string }>
}

export default async function Home({ searchParams }: Props) {
  const { q, location, capacity, sort } = await searchParams
  const locations = await getLocations()
  const villas = await getAllVillas(q, location, capacity, sort)

  const hasFilters = q || location || capacity || sort

  return (
    <>
      <HeroSection />

      <div className="relative z-20 -mt-12 sm:-mt-16">
        <Container>
          <SearchCard
            defaultValue={q}
            selectedLocation={location}
            capacity={capacity}
            sort={sort}
            locations={locations}
          />
        </Container>
      </div>

      <section id="villa-discovery" className="pb-16 pt-8 sm:pt-12">
        <Container>
          <div className="mb-8">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Villa Terverifikasi Pilihan Anda
              </h2>
              <p className="text-sm text-muted-foreground">
                Menampilkan {villas.length} Villa
              </p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Semua villa telah diverifikasi untuk kenyamanan dan keamanan booking Anda.
            </p>
          </div>

          {villas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                {hasFilters
                  ? 'Tidak ada villa yang cocok dengan filter yang dipilih'
                  : 'Belum ada villa tersedia'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {villas.map((villa) => (
                <VillaCard key={villa.id} villa={villa} />
              ))}
            </div>
          )}
        </Container>
      </section>

      <TestimonialSection />

      <CtaSection />
    </>
  )
}
