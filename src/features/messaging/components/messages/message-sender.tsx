import type { User } from "@/types/general"
import { getParticipantNameColor } from "@/lib/utils"

type MessageSenderProps = {
    user: User
}

export function MessageSender({ user }: MessageSenderProps) {
    return (
        <span
            className="px-1 text-xs font-medium"
            style={{ color: getParticipantNameColor(user.id) }}
        >
            {user.username}
        </span>
    )
}