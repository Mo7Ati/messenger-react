import { contactService, type GetContactResponse, type PendingRequest, type SearchUser } from "@/services/contacts-service"
import type { User } from "@/types/general"
import { useQuery } from "@tanstack/react-query"



export const useContacts = () => {
    return useQuery<User[], Error>({
        queryKey: ["contacts"],
        queryFn: contactService.getContacts,
    })
}
export const useContact = (id: number, enabled: boolean) => {
    return useQuery<GetContactResponse, Error>({
        queryKey: ["contact", id],
        queryFn: () => contactService.getContact(id),
        enabled: enabled && !!id,
    })
}

export const useSearchUsers = (query: string) => {
    return useQuery<SearchUser[], Error>({
        queryKey: ["searchUsers", query],
        queryFn: () => contactService.searchUsers(query),
    })
}

export const usePendingRequests = () => {
    return useQuery<PendingRequest[], Error>({
        queryKey: ["pendingRequests"],
        queryFn: contactService.getPendingRequests,
    })
}