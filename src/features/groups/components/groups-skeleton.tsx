import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function GroupsSkeleton() {
  return (
    <Card className="h-full flex flex-col w-100 overflow-hidden rounded-none">
      <CardHeader className="space-y-4 pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-9 w-20 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardHeader>

      <CardContent className="flex-1 min-h-0 p-0">
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-4">
              <Skeleton className="h-11 w-11 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-3/4" />
              </div>
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
