import type { ChatType, Message } from "@/types/general"
import { EmptyState } from "@/components/empty-state"
import { MessageItem } from "../messages/message-item"
import { useEffect, useRef } from "react"

type MessagesListProps = {
    messages: Message[]
    chatType?: ChatType
}

export function ChatMessages({
    messages,
    chatType = "peer",
}: MessagesListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
        })
    }, [messages])

    if (!messages.length) {
        return <EmptyState variant="no-messages" />
    }

    return (
        <div ref={scrollRef} className="h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
                {messages.map((message, index) => {
                    const previousMessage = index > 0 ? messages[index - 1] : null

                    return (
                        <MessageItem
                            key={message.id}
                            message={message}
                            previousMessage={previousMessage}
                            chatType={chatType}
                        />
                    )
                })}
            </div>
        </div>
    )
}