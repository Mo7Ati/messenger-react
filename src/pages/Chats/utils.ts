import { useQuery } from "@tanstack/react-query"
import api from "@/lib/api"
import type { Chat } from "@/types/general"

export function useChats() {
  return useQuery<Chat[], Error>({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await api<Chat[]>("/conversations")
      return data
    },
  })
}

export function useChat(id: number) {
  return useQuery<Chat, Error>({
    queryKey: ["chat", id],
    queryFn: async () => {
      const { data } = await api<Chat>(`/conversations/${id}`)
      return data
    },
  })
}