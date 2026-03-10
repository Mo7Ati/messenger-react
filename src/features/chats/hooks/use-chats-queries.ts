import { useQuery } from "@tanstack/react-query"
import { chatsService } from "@/features/chats/chats-service"
import type { Chat } from "@/types/general"

export function useChats() {
    return useQuery<Chat[], Error>({
        queryKey: ["chats"],
        queryFn: chatsService.getChats,
    })
}

export function useChat(id: number, enabled: boolean) {
    return useQuery<Chat, Error>({
        queryKey: ["chat", id],
        queryFn: () => chatsService.getChat(id),
        enabled: enabled && !!id,
    })
}
