import type { User } from "@/types/general"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

type MessageAvatarProps = {
    user: User
}

export function MessageAvatar({ user }: MessageAvatarProps) {
    return (
        <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar_url} alt={user.username} />
            <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}