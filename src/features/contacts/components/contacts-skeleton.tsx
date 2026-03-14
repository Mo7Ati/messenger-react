import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ContactsSkeleton() {
  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-none md:w-96">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-8 w-28" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-xl" />
            <Skeleton className="h-9 w-24 rounded-xl" />
          </div>
        </div>
        <div className="mt-3">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-0">
        <div className="pb-4">
          {[1, 2, 3].map((group) => (
            <div key={group} className="mb-4">
              <p className="mb-1 px-4">
                <Skeleton className="h-3 w-4" />
              </p>
              <div className="space-y-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-4 py-2"
                  >
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-4 w-4 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
