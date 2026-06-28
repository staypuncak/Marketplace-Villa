import { Container } from '@/components/shared/container'
import { VillaCard } from '@/components/public/villa-card'
import { getAllVillas } from '@/lib/supabase/queries'

export default async function Home() {
  const villas = await getAllVillas()

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
          <h2 className="mb-8 text-2xl font-semibold tracking-tight">
            Villa Tersedia
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {villas.map((villa) => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
