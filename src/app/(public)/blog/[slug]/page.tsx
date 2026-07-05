import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Container } from '@/components/shared/container'
import { getPostBySlug, getPublishedPosts } from '@/lib/supabase/queries'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const { blogArticles } = await import('@/data/blog')
    return blogArticles.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-emerald-900" />
        {post.featured_image_url && (
          <>
            <img
              src={post.featured_image_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent" />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
        <Container className="relative z-10">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white"
          >
            &larr; Kembali ke Blog
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-sm text-white/60">
              {post.category && (
                <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-amber-400">
                  {post.category}
                </span>
              )}
              <span>{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl leading-tight text-white sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
                {post.excerpt}
              </p>
            )}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-5">
              {post.content.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p key={i} className="leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ) : null
              )}
            </div>

            <div className="mt-12 border-t pt-8">
              <Link
                href="/blog"
                className="text-sm font-medium text-brand hover:underline"
              >
                &larr; Kembali ke Blog
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
