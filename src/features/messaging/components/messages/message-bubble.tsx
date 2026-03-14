import { cn } from "@/lib/utils"
import type { Message } from "@/types/general"
import { MessageAttachments } from "./message-attachments"
import { MessageMeta } from "./message-meta"


type MessageBubbleProps = {
    message: Message
    isGroup?: boolean
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const hasBody = !!message.body?.trim()
    const hasAttachments = !!message.attachments?.length

    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl px-3 py-2",
                message.is_mine
                    ? "rounded-br-md bg-primary text-primary-foreground"
                    : "rounded-bl-md bg-accent text-foreground"
            )}
        >
            <div className="flex flex-col gap-2">
                {hasBody ? (
                    <p className="whitespace-pre-wrap text-sm [overflow-wrap:anywhere]">
                        {message.body}
                    </p>
                ) : null}

                {hasAttachments ? (
                    <MessageAttachments attachments={message.attachments ?? []} />
                ) : null}

                <MessageMeta message={message} />
            </div>
        </div>
    )
}