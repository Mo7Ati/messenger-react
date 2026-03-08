import type { ApiSuccessResponse } from "@/lib/api"
import { contactService, type GetContactResponse, type PendingRequest, type SearchUser } from "@/services/contacts-service"
import type { User } from "@/types/general"
import { useQuery } from "@tanstack/react-query"

export const useContacts = (options?: { enabled?: boolean }) => {
    return useQuery<ApiSuccessResponse<User[]>, Error>({
        queryKey: ["contacts"],
        queryFn: contactService.getContacts,
        enabled: options?.enabled !== false,
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
    return useQuery<User[], Error>({
        queryKey: ["pendingRequests"],
        queryFn: contactService.getPendingRequests,
    })
}

export const useSentRequests = () => {
    return useQuery<User[], Error>({
        queryKey: ["sentRequests"],
        queryFn: contactService.getSentRequests,
    })
}