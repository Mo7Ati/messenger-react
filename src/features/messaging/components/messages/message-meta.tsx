import type { Message } from "@/types/general"

type MessageMetaProps = {
    message: Message
}

export function MessageMeta({ message }: MessageMetaProps) {
    return (
        <div className="flex justify-end">
            <span className="text-[11px] opacity-70">
                {message.created_at}
            </span>
        </div>
    )
}