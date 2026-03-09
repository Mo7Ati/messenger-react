import { useState } from "react"
import { toast } from "sonner"
import { useAcceptContactRequest, useDeclineContactRequest } from "./use-contacts-mutations"
import { usePendingRequests, useSentRequests } from "./use-contacts-queries"
import type { PendingRequest } from "@/types/contacts"

type TabId = "received" | "sent"

export function useContactRequests() {
    const [activeTab, setActiveTab] = useState<TabId>("received")
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

    const pendingQuery = usePendingRequests()
    const sentQuery = useSentRequests()
    const acceptMutation = useAcceptContactRequest()
    const declineMutation = useDeclineContactRequest()

    const received = pendingQuery.data ?? []
    const sent = sentQuery.data ?? []

    const loading = activeTab === "received" ? pendingQuery.isLoading : sentQuery.isLoading
    const error = activeTab === "received" ? pendingQuery.error : null
    const requests = activeTab === "received" ? received : sent

    const handleAccept = async (request: PendingRequest) => {
        const userId = request.user?.id ?? request.id
        setActionLoadingId(userId)
        try {
            await acceptMutation.mutateAsync(userId)
            toast.success("Contact request accepted")
        } catch (err) {
            const message =
                err && typeof err === "object" && "message" in err
                    ? String((err as { message: string }).message)
                    : "Failed to accept request"
            toast.error(message)
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleDecline = async (request: PendingRequest) => {
        const userId = request.user?.id ?? request.id
        setActionLoadingId(userId)
        try {
            await declineMutation.mutateAsync(userId)
            toast.success("Request declined")
        } catch (err) {
            const message =
                err && typeof err === "object" && "message" in err
                    ? String((err as { message: string }).message)
                    : "Failed to decline request"
            toast.error(message)
        } finally {
            setActionLoadingId(null)
        }
    }

    return {
        activeTab,
        setActiveTab,
        received,
        sent,
        loading,
        error,
        requests,
        actionLoadingId,
        handleAccept,
        handleDecline,
        refetchReceived: pendingQuery.refetch,
    }
}
