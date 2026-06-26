import { cn } from '@/lib/utils'

type ContainerProps = React.ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'article'
}

export function Container({
  as: Tag = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full max-w-(--breakpoint-xl) px-4 sm:px-6 lg:px-8', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
