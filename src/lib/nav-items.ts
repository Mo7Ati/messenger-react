import { MessageCircle, Settings, Sparkles, UserRound, Users } from "lucide-react";

export type NavItem = {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
}

export const navItems: NavItem[] = [
    { label: "Chats", path: "/", icon: MessageCircle },
    { label: "Contacts", path: "/contacts", icon: Users },
    { label: "Groups", path: "/groups", icon: UserRound },
    { label: "Settings", path: "/settings", icon: Settings },
    { label: "Highlights", path: "/highlights", icon: Sparkles },
]