import { Container } from '@/components/shared/container'
import { VillaCard } from '@/components/public/villa-card'
import { SearchInput } from '@/components/public/search-input'
import { getAllVillas } from '@/lib/supabase/queries'

type Props = {
  searchParams: Promise<{ q?: string }>
}

export default async function Home({ searchParams }: Props) {
  const { q } = await searchParams
  const villas = await getAllVillas(q)

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
            <SearchInput defaultValue={q} />
          </div>

          {villas.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                Tidak ada villa yang cocok dengan &ldquo;{q}&rdquo;
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
