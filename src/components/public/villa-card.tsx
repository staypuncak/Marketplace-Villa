import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Villa } from '@/types/villa'

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

type VillaCardProps = {
  villa: Villa
}

export function VillaCard({ villa }: VillaCardProps) {
  return (
    <Link href={`/villa/${villa.slug}`} className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-[16/9] bg-muted" />
        <CardHeader>
          <CardTitle className="text-lg">{villa.name}</CardTitle>
          <CardDescription>{villa.location}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="line-clamp-2 text-muted-foreground">
            {villa.description}
          </p>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold text-brand">
              {formatPrice(villa.price)}
              <span className="text-sm font-normal text-muted-foreground">
                /malam
              </span>
            </span>
            <span className="text-sm text-muted-foreground">
              {villa.capacity} tamu
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
