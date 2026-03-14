import { Outlet } from "react-router"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

type PageLayoutProps = {
    list: ReactNode
    showDetail: boolean
    className?: string
}

const PageLayout = ({
    list,
    showDetail,
    className,
}: PageLayoutProps) => {
    const isMobile = useIsMobile()
    const showList = !isMobile || !showDetail

    return (
        <div className={cn("flex h-full w-full", !isMobile && "gap-6 md:p-10", className)}>
            {showList && list}

            {(!isMobile || showDetail) && (
                <div className="flex min-h-0 min-w-0 flex-1 flex-col md:p-1">
                    <Outlet />
                </div>
            )}
        </div>
    )
}

export default PageLayout