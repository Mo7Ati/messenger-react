import { cn } from "@/lib/utils"
import type { Message } from "@/types/general"
import { MessageAvatar } from "./message-avatar"
import { MessageSender } from "./message-sender"
import { MessageBubble } from "./message-bubble"

type MessageItemProps = {
    message: Message
    previousMessage: Message | null
    chatType: "peer" | "group"
}

export function MessageItem({
    message,
    previousMessage,
    chatType,
}: MessageItemProps) {
    const isMine = message.is_mine
    const isGroup = chatType === "group"

    const showSenderInfo =
        isGroup &&
        !isMine &&
        (!previousMessage || previousMessage.user_id !== message.user_id)

    return (
        <div className={cn("flex w-full items-end gap-2", isMine && "justify-end")}>
            {!isMine && isGroup ? (
                <div className="w-8 shrink-0">
                    {showSenderInfo ? <MessageAvatar user={message.user} /> : null}
                </div>
            ) : null}

            <div
                className={cn(
                    "flex max-w-[85%] flex-col gap-1 sm:max-w-[75%] md:max-w-[60%]",
                    isMine && "items-end"
                )}
            >
                {showSenderInfo ? <MessageSender user={message.user} /> : null}

                <MessageBubble message={message} isGroup={isGroup} />
            </div>
        </div>
    )
}