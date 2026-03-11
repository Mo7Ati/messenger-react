import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

type SidebarPanelProps = {
    hiddenOnMobileDetail?: boolean
    title: string
    searchPlaceholder: string
    searchQuery: string
    onSearchChange: (value: string) => void
    actions?: ReactNode
    isLoading?: boolean
    skeleton?: ReactNode
    children: ReactNode
    className?: string
    contentClassName?: string
    useScrollArea?: boolean
}

export function SidebarPanel({
    hiddenOnMobileDetail,
    title,
    searchPlaceholder,
    searchQuery,
    onSearchChange,
    actions,
    isLoading,
    skeleton,
    children,
    className,
    contentClassName,
    useScrollArea = true,
}: SidebarPanelProps) {
    if (isLoading) return <>{skeleton}</>

    const content = useScrollArea ? (
        <ScrollArea className="h-full">{children}</ScrollArea>
    ) : (
        children
    )

    return (
        <Card
            className={cn(
                hiddenOnMobileDetail && "hidden",
                "flex h-full w-full flex-col overflow-hidden rounded-none md:w-96",
                className
            )}
        >
            <CardHeader className="shrink-0 pb-3">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
                    {actions}
                </div>

                <div className="relative mt-3">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="rounded-xl pl-9"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
            </CardHeader>

            <CardContent className={cn("min-h-0 flex-1 p-0", contentClassName)}>
                {content}
            </CardContent>
        </Card>
    )
}