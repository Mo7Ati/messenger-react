import { useMutation, useQueryClient } from "@tanstack/react-query"
import { contactService } from "@/features/contacts/contacts-service"

export function useAcceptContactRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: number) => contactService.acceptContactRequest(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
            queryClient.invalidateQueries({ queryKey: ["contacts"] })
        },
    })
}

export function useDeclineContactRequest() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: number) => contactService.declineContactRequest(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["pendingRequests"] })
        },
    })
}

export function useSendContactRequest() {
    return useMutation({
        mutationFn: (userId: number) => contactService.sendContactRequest(userId),
    })
}
