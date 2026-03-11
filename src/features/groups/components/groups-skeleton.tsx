import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GroupsSkeleton() {
  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-none md:w-96">
      <CardHeader className="shrink-0 space-y-4 pb-3 px-4 sm:px-6">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-7 w-24 shrink-0" />
          <Skeleton className="h-9 w-20 shrink-0 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-0">
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex min-w-0 items-center gap-3 px-4 py-3 sm:py-4"
            >
              <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 min-w-0 flex-1 max-w-32 sm:max-w-40" />
                  <Skeleton className="h-3 w-12 shrink-0 sm:w-16" />
                </div>
                <Skeleton className="h-3 w-3/4 max-w-full" />
              </div>
              <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
