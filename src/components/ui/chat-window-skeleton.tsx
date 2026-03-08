import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"


export const ChatWindowSkeleton = () => {
  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-background">
      <div className="flex items-center gap-3 px-4 py-3 border rounded-2xl bg-background">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex-1 min-w-0 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={cn("flex w-full", i % 2 === 0 ? "justify-start" : "justify-end")}
          >
            <Skeleton className="h-10 w-2/3" />
          </div>
        ))}
      </div>

      <div className="border-t px-4 py-3 bg-background">
        <div className="flex items-center gap-2 mx-auto min-w-0">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  )
}
