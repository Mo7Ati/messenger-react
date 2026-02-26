import * as React from "react"
import { cn } from "@/lib/utils"
import {
  MessageCircle,
  Settings,
  Sparkles,
  User,
  UserRound,
  Users,
} from "lucide-react"
import { Button } from "./ui/button"
import { useNavigate } from "react-router"

const navItems: { label: string; path: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: "Chats", path: "/", icon: MessageCircle },
  { label: "Contacts", path: "/contacts", icon: Users },
  { label: "Groups", path: "/groups", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
  { label: "Highlights", path: "/highlights", icon: Sparkles },
]

const SideNavbar = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = React.useState<string>("/")

  return (
    <div>
      {/* Desktop / tablet sidebar */}
      <aside className="hidden w-16 h-full flex-col items-center justify-between border-r bg-background px-3 py-6 md:flex">
        {/* Top logo / app icon */}
        <Button
          variant="default"
          size="icon"
          aria-label="Dashboard"
          onClick={() => navigate("/")}
        >
          <MessageCircle size={30} />
        </Button>

        {/* Middle navigation icons */}
        <nav className="flex flex-col items-center gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.path === activeItem

            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => {
                  setActiveItem(item.path)
                }}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-3xl text-slate-400 transition-all",
                  "hover:text-indigo-500 hover:bg-slate-100",
                  isActive && "bg-indigo-50 text-indigo-500 shadow-sm shadow-indigo-100"
                )}
                aria-label={item.label}
                aria-pressed={isActive}
              >
                <Icon className="h-5 w-5" />
              </Button>
            )
          })}
        </nav>

        {/* Bottom user avatar */}
        <Button
          // variant="default"
          size="icon"
          // className="mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-transparent bg-linear-to-tr from-pink-400 to-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-100"
          aria-label="Open profile"
        >
          <User size={30} />
        </Button>
      </aside>

      {/* Mobile bottom navigation bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-center border-t bg-background/90 px-4 py-2 shadow-lg backdrop-blur md:hidden">
        <div className="flex w-full max-w-md items-center justify-between gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.path === activeItem

            return (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => setActiveItem(item.path)}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-3xl px-2 py-2 text-slate-400 transition-all",
                  "hover:text-indigo-500 hover:bg-slate-100",
                  isActive && "bg-indigo-50 text-indigo-500 shadow-sm shadow-indigo-100"
                )}
                aria-label={item.label}
                aria-pressed={isActive}
              >
                <Icon className="h-5 w-5" />
              </Button>
            )
          })}

          {/* Avatar on the right, matching the screenshot */}
          <Button
            variant="default"
            size="icon"
            // className="flex h-10 w-10 items-center justify-center rounded-full border border-transparent bg-linear-to-tr from-pink-400 to-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-100"
            aria-label="Open profile"
          >
            <User size={30} />
          </Button>
        </div >
      </nav >
    </div>
  )
}

export default SideNavbar
