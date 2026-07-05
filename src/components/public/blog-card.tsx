import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { BlogPostItem } from '@/lib/supabase/queries'

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  } catch {
    return date
  }
}

type BlogCardProps = {
  article: BlogPostItem
  featured?: boolean
}

export function BlogCard({ article, featured }: BlogCardProps) {
  return (
    <Link href={`/blog/${article.slug}`}>
      <Card
        className={`overflow-hidden transition-shadow hover:shadow-lg ${featured ? 'sm:grid sm:grid-cols-2 sm:gap-0' : ''}`}
      >
        <div className={`relative overflow-hidden ${featured ? 'aspect-[16/9] sm:aspect-auto sm:h-full' : 'aspect-[16/9]'}`}>
          {article.featured_image_url ? (
            <img
              src={article.featured_image_url}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>
        <div>
          <CardHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-medium text-brand">
                {article.category}
              </span>
              <span>{formatDate(article.date)}</span>
            </div>
            <CardTitle className={featured ? 'text-xl sm:text-2xl' : 'text-lg'}>
              {article.title}
            </CardTitle>
            <CardDescription className={featured ? 'text-sm sm:text-base' : 'text-sm'}>
              {article.excerpt}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-medium text-brand">
              Baca Selengkapnya &rarr;
            </span>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
