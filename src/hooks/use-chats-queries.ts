import { useMutation, useQuery } from "@tanstack/react-query"
import { chatsService } from "@/services/chats-service"
import type { Chat } from "@/types/general"

export type CreateChatParams = {
  label: string
  participants_ids: number[]
}

export function useChats() {
  return useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: () => chatsService.getChats(),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export function useChat(id: number, enabled: boolean) {
  return useQuery<Chat, Error>({
    queryKey: ["chat", id],
    queryFn: () => chatsService.getChat(id),
    enabled: enabled && !!id,
  })
}

export function useCreateChat() {
  return useMutation<Chat, Error, CreateChatParams>({
    mutationFn: (params) => chatsService.createChat(params),
  })
}
