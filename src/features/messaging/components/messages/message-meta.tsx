import type { Message } from "@/types/general"
import { Check, CheckCheck } from "lucide-react"

type MessageMetaProps = {
    message: Message
}

export function MessageMeta({ message }: MessageMetaProps) {
    return (
        <div className="flex items-center justify-end gap-1">
            <span className="text-[11px] opacity-70">
                {message.created_at}
            </span>
            {message.is_mine && (
                message.is_read_by_all
                    ? <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                    : <Check className="h-3.5 w-3.5 opacity-70" />
            )}
        </div>
    )
}