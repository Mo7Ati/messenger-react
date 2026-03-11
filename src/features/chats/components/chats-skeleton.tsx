import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ChatsSkeleton() {
    return (
        <Card className="flex h-full w-full flex-col overflow-hidden rounded-none md:w-96">
            {/* Header */}
            <CardHeader className="shrink-0 space-y-4 pb-3">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-28" />
                </div>

                {/* Search */}
                <Skeleton className="h-10 w-full rounded-xl" />
            </CardHeader>

            {/* List */}
            <CardContent className="min-h-0 flex-1 p-0">
                <div className="divide-y">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                            {/* Avatar */}
                            <Skeleton className="h-11 w-11 rounded-full shrink-0" />

                            {/* Text */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                                <Skeleton className="h-3 w-3/4" />
                            </div>

                            {/* Unread badge */}
                            <Skeleton className="h-6 w-6 rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}