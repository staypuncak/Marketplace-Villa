import { Container } from '@/components/shared/container'
import { VillaCard } from '@/components/public/villa-card'
import { SearchInput } from '@/components/public/search-input'
import { LocationFilter } from '@/components/public/location-filter'
import { CapacityFilter } from '@/components/public/capacity-filter'
import { getAllVillas, getLocations } from '@/lib/supabase/queries'

type Props = {
  searchParams: Promise<{ q?: string; location?: string; capacity?: string }>
}

export default async function Home({ searchParams }: Props) {
  const { q, location, capacity } = await searchParams
  const locations = await getLocations()
  const villas = await getAllVillas(q, location, capacity)

  const hasFilters = q || location || capacity

  return (
    <>
      <section className="flex min-h-[50vh] items-center justify-center bg-gradient-to-b from-brand/5 to-background">
        <Container className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            StayPuncak
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Sewa villa di Puncak Bogor
          </p>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Villa Tersedia
            </h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <CapacityFilter
                selectedCapacity={capacity}
                search={q}
                location={location}
              />
              <LocationFilter
                locations={locations}
                selectedLocation={location}
                search={q}
                capacity={capacity}
              />
              <SearchInput
                defaultValue={q}
                selectedLocation={location}
                capacity={capacity}
              />
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
