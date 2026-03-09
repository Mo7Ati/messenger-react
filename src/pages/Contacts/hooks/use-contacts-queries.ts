import { useQuery } from "@tanstack/react-query"
import { contactService } from "@/services/contacts-service"
import type { ApiSuccessResponse } from "@/lib/api"
import type { User } from "@/types/general"
import type { GetContactResponse, SearchUser } from "@/types/contacts"

export function useContacts(options?: { enabled?: boolean }) {
    return useQuery<ApiSuccessResponse<User[]>, Error>({
        queryKey: ["contacts"],
        queryFn: contactService.getContacts,
        enabled: options?.enabled !== false,
    })
}

export function useContact(id: number, enabled: boolean) {
    return useQuery<GetContactResponse, Error>({
        queryKey: ["contact", id],
        queryFn: () => contactService.getContact(id),
        enabled: enabled && !!id,
    })
}

export function useSearchUsers(query: string) {
    return useQuery<SearchUser[], Error>({
        queryKey: ["searchUsers", query],
        queryFn: () => contactService.searchUsers(query),
        enabled: query.length >= 2,
    })
}

export function usePendingRequests() {
    return useQuery<User[], Error>({
        queryKey: ["pendingRequests"],
        queryFn: contactService.getPendingRequests,
    })
}

export function useSentRequests() {
    return useQuery<User[], Error>({
        queryKey: ["sentRequests"],
        queryFn: contactService.getSentRequests,
    })
}
