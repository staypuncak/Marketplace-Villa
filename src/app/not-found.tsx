import Link from 'next/link'
import { Container } from '@/components/shared/container'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Villa tidak ditemukan
      </p>
      <Link
        href="/"
        className={cn(buttonVariants({ variant: 'default' }), 'mt-6')}
      >
        Kembali ke Beranda
      </Link>
    </Container>
  )
}
