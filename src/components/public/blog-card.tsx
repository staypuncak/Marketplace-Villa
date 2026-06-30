import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { BlogArticle } from '@/data/blog'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

type BlogCardProps = {
  article: BlogArticle
  featured?: boolean
}

export function BlogCard({ article, featured }: BlogCardProps) {
  return (
    <Card
      className={`overflow-hidden transition-shadow hover:shadow-lg ${featured ? 'sm:grid sm:grid-cols-2 sm:gap-0' : ''}`}
    >
      <div className={`bg-muted ${featured ? 'aspect-[16/9] sm:aspect-auto sm:h-full' : 'aspect-[16/9]'}`} />
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
  )
}
