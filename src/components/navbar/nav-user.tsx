import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/features/auth/auth-context";
import {
    BadgeCheckIcon,
    LogOutIcon,
    MoonIcon,
    SunIcon,
} from "lucide-react"
import { useNavigate } from "react-router"
import { useTheme } from "next-themes"


export function NavUser() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();
    if (!user) return null;

    const isDark = theme === "dark"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={user.avatar_url} alt={user.username} />
                        <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <BadgeCheckIcon />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme(isDark ? "light" : "dark")}>
                        {isDark ? <SunIcon /> : <MoonIcon />}
                        {isDark ? "Light mode" : "Dark mode"}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOutIcon />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
