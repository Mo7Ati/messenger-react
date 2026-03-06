import api from "@/lib/api"
import type { Chat, User } from "@/types/general"
import { useQuery } from "@tanstack/react-query"


type ShowContactResponse = {
    chat: Chat | null,
    contact: User,
}

export const useContacts = () => {
    return useQuery<User[], Error>({
        queryKey: ["contacts"],
        queryFn: async () => {
            const { data } = await api<User[]>("/contacts")
            return data
        },
    })
}
export const useContact = (id: number, enabled: boolean) => {
    return useQuery<ShowContactResponse, Error>({
        queryKey: ["contact", id],
        queryFn: async () => {
            const { data } = await api<ShowContactResponse>(`/contacts/${id}`)
            return data
        },
        enabled: enabled && !!id,
    })
}
