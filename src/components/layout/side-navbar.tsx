import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { MessageSquare, Users, User, Sparkles, MessageCircleCode } from "lucide-react"
import { NavLink, useLocation, useNavigate, useParams } from "react-router"
import { NavUser } from "@/components/nav-user"

type NavItem = {
  label: string
  href: string
  icon: React.ElementType
}

const items: NavItem[] = [
  { label: "Chats", href: "/chats", icon: MessageSquare },
  { label: "Groups", href: "/groups", icon: Users },
  { label: "Contacts", href: "/contacts", icon: User },
  { label: "Highlights", href: "/highlights", icon: Sparkles },
]

function NavIcon({
  item,
  active,
}: {
  item: NavItem
  active: boolean
}) {
  const Icon = item.icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className={cn(
            "h-12 w-12 rounded-2xl",
            "text-muted-foreground hover:text-foreground",
            "hover:bg-muted/60",
            active && "bg-muted text-foreground"
          )}
        >
          <NavLink to={item.href} aria-label={item.label}>
            <Icon className="h-5 w-5" />
          </NavLink>
        </Button>
      </TooltipTrigger>

      {/* Tooltips only on desktop */}
      <TooltipContent side="right" className="hidden md:block text-xs">
        {item.label}
      </TooltipContent>
    </Tooltip>
  )
}

export default function SideNavbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { chatId, contactId, groupId } = useParams()
  const isChatWindowOpen =
    chatId != null ||
    groupId != null ||
    (contactId != null && location.pathname !== "/contacts/requests")

  return (
    <TooltipProvider delayDuration={150}>
      {/* DESKTOP: Left Sidebar */}
      <aside
        className={cn(
          "hidden md:flex",
          "h-screen w-[72px] shrink-0",
          "border-r bg-background",
          "flex-col items-center justify-between py-4"
        )}
      >
        <MessageCircleCode className="text-primary mt-3 hover:text-primary/80 cursor-pointer" size={30} onClick={() => navigate("/chats")} />

        <div className="flex flex-col items-center gap-3">
          {items.map((item) => (
            <NavIcon key={item.href} item={item} active={location.pathname === item.href} />
          ))}
        </div>

        <div>
          <Separator className="w-10 my-2" />
          <React.Suspense fallback={<div>Loading...</div>}>
            <NavUser />
          </React.Suspense>
        </div>

      </aside>

      {/* MOBILE: Bottom Bar (hidden when a chat/conversation is open) */}
      <nav
        className={cn(
          "md:hidden",
          "fixed bottom-0 left-0 right-0 z-50",
          "border-t bg-background/95 backdrop-blur",
          "px-3 py-2",
          "transition-transform duration-200",
          isChatWindowOpen && "translate-y-full"
        )}
      >
        <div className="mx-auto flex max-w-md items-center justify-between">
          {items.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="icon"
              className={cn(
                "h-12 w-12 rounded-2xl",
                "text-muted-foreground hover:text-foreground",
                location.pathname === item.href && "bg-muted text-foreground"
              )}
            >
              <NavLink to={item.href} aria-label={item.label}>
                <item.icon className="h-5 w-5" />
              </NavLink>
            </Button>
          ))}
          <NavUser />
        </div>
      </nav>
    </TooltipProvider>
  )
}