import api from "@/lib/api"
import type { Chat } from "@/types/general"

export type CreateGroupParams = {
  label: string
  avatar_url?: string
  participants_ids: number[]
}

export const groupsService = {
  getGroups: async (): Promise<Chat[]> => {
    const { data } = await api.get<Chat[]>("/groups")
    return data
  },
  getGroup: async (id: number): Promise<Chat> => {
    const { data } = await api.get<Chat>(`/groups/${id}`)
    return data
  },
  createGroup: async (params: CreateGroupParams): Promise<Chat> => {
    const { data } = await api.post<Chat>("/groups", {
      label: params.label,
      // avatar_url: params.avatar_url ?? undefined,
      participants_ids: params.participants_ids,
    })
    return data
  }
}
