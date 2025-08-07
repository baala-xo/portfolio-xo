export function ProjectCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-8 h-8 rounded-full bg-muted mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-16" />
            </div>
            <div className="space-y-1">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
            <div className="flex gap-1">
              <div className="h-3 bg-muted rounded w-16" />
              <div className="h-3 bg-muted rounded w-20" />
              <div className="h-3 bg-muted rounded w-14" />
            </div>
          </div>
        </div>
        <div className="hidden sm:flex flex-col gap-2">
          <div className="h-4 bg-muted rounded w-12" />
          <div className="h-4 bg-muted rounded w-10" />
        </div>
      </div>
    </div>
  )
}
