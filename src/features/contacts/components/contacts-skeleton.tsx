"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ContactsSkeleton() {
  return (
    <Card className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <CardHeader className="space-y-4 pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>

        {/* Search */}
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardHeader>

      {/* List */}
      <CardContent className="flex-1 min-h-0 p-0">
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-4">
              {/* Avatar */}
              <Skeleton className="h-11 w-11 rounded-full shrink-0" />

              {/* Text */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
