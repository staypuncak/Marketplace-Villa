import { Container } from '@/components/shared/container'
import { VillaCard } from '@/components/public/villa-card'
import { HeroSection } from '@/components/public/hero-section'
import { RotateCcw } from 'lucide-react'
import { SearchInput } from '@/components/public/search-input'
import { LocationFilter } from '@/components/public/location-filter'
import { CapacityFilter } from '@/components/public/capacity-filter'
import { PriceSort } from '@/components/public/price-sort'
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

      <section id="villa-discovery" className="py-16">
        <Container>
          <div className="mb-8 space-y-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-2xl font-semibold tracking-tight">
                Villa Tersedia
              </h2>
              <p className="text-sm text-muted-foreground">
                Menampilkan {villas.length} Villa
              </p>
            </div>

            <SearchInput
              defaultValue={q}
              selectedLocation={location}
              capacity={capacity}
              sort={sort}
            />

            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row">
              <LocationFilter
                locations={locations}
                selectedLocation={location}
                search={q}
                capacity={capacity}
                sort={sort}
              />
              <CapacityFilter
                selectedCapacity={capacity}
                search={q}
                location={location}
                sort={sort}
              />
              <PriceSort
                selectedSort={sort}
                search={q}
                location={location}
                capacity={capacity}
              />
              <form method="GET" action="/#villa-discovery">
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-brand bg-transparent px-3 py-2 text-sm text-brand transition-colors hover:bg-brand hover:text-white sm:w-auto"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </button>
              </form>
            </div>
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

    </>
  )
}
