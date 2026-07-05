import Link from 'next/link'
import type { Metadata } from 'next'
import { Container } from '@/components/shared/container'
import { BlogCard } from '@/components/public/blog-card'
import { getPublishedPosts } from '@/lib/supabase/queries'

export const metadata: Metadata = {
  title: 'Panduan Liburan & Villa Puncak',
  description:
    'Temukan tips memilih villa Puncak, rekomendasi liburan keluarga, dan panduan sewa villa di Puncak Bogor agar perjalanan Anda lebih nyaman dan berkesan.',
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()
  const [featured, ...rest] = posts

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <Container className="relative z-10">
          <div className="max-w-2xl">
            <h1 className="font-serif text-3xl leading-tight text-white sm:text-5xl">
              Panduan Liburan & Villa Puncak
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Temukan tips memilih villa Puncak, rekomendasi liburan keluarga, dan panduan sewa
              villa di Puncak Bogor agar perjalanan Anda lebih nyaman dan berkesan.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="space-y-12">
          {featured && (
            <div>
              <h2 className="mb-6 text-lg font-semibold tracking-wide text-muted-foreground sm:text-xl">
                Artikel Terbaru
              </h2>
              <BlogCard article={featured} featured />
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Siap Menemukan Villa Impian?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Jelajahi koleksi villa terbaik kami di Puncak Bogor. Booking mudah via WhatsApp
              tanpa biaya tambahan.
            </p>
            <Link
              href="/#villa-discovery"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand/90"
            >
              Jelajahi Villa
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
