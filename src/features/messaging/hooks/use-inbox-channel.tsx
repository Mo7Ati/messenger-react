import { useUser } from "@/features/auth/auth-context"
import type { Chat, Message } from "@/types/general";
import { useEcho } from "@laravel/echo-react"
import { useQueryClient } from "@tanstack/react-query";

const useInboxChannel = () => {
    const user = useUser();
    const queryClient = useQueryClient();

    const syncIncomingMessage = (message: Message) => {
        const cacheKey = message.chat?.type === "group" ? "groups" : "chats";

        queryClient.setQueryData<Chat[]>([cacheKey], (items) => {
            if (!items) return [message.chat!];

            if (items.length === 0) {
                const chat: Chat = {
                    id: message.chat_id ?? 0,
                    label: message.user.username ?? "unknown",
                    type: "peer",
                    last_message: message,
                    messages: [message],
                    new_messages: 1,
                    created_at: message.created_at,
                    participants: [message.user],
                }
                return [chat]
            }

            return items.map((item) => {
                if (item.id === message.chat_id) {
                    return {
                        ...item,
                        last_message: message,
                        new_messages: message.is_mine ? item.new_messages : item.new_messages + 1,
                    }
                }
                return item
            })
        })
    }

    const { channel } = useEcho<Message>(`messenger.user.${user.id}`, "MessageCreated", syncIncomingMessage);
}

export default useInboxChannel