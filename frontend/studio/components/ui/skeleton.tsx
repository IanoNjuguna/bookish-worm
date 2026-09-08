import { cn } from '@/lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse glass rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }
