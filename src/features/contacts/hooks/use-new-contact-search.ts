import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useDebounce } from "@/hooks/use-debounce"
import { contactService } from "@/features/contacts/contacts-service"
import type { User } from "@/types/general"

export function useNewContactSearch(isOpen: boolean, onClose: () => void) {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)

    const debouncedQuery = useDebounce(searchQuery.trim(), 500)

    const fetchSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSearchResults([])
            return
        }
        setLoading(true)
        setError(null)
        try {
            const data = await contactService.searchUsers(query)
            setSearchResults(Array.isArray(data) ? data : [])
        } catch (err) {
            const message = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Failed to search users"
            setError(message)
            setSearchResults([])
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (debouncedQuery.length >= 2) {
            fetchSearch(debouncedQuery)
        } else {
            setSearchResults([])
            setError(null)
        }
    }, [debouncedQuery, fetchSearch])

    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("")
            setSearchResults([])
            setError(null)
        }
    }, [isOpen])

    const handleSendRequest = async (user: User) => {
        setActionLoadingId(user.id)
        try {
            await contactService.sendContactRequest(user.id)
            setSearchResults((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, contact_status: "request_sent" as const } : u
                )
            )
            toast.success("Contact request sent")
        } catch (err) {
            const message = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Failed to send request"
            toast.error(message)
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleAcceptRequest = async (user: User) => {
        setActionLoadingId(user.id)
        try {
            await contactService.acceptContactRequest(user.id)
            setSearchResults((prev) =>
                prev.map((u) =>
                    u.id === user.id ? { ...u, contact_status: "contacts" as const } : u
                )
            )
            toast.success("Contact added")
        } catch (err) {
            const message = err && typeof err === "object" && "message" in err
                ? String((err as { message: string }).message)
                : "Failed to accept request"
            toast.error(message)
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleStartChat = (user: User) => {
        onClose()
        navigate(`/contacts/${user.id}`, { state: { contact: user } })
    }

    return {
        searchQuery,
        setSearchQuery,
        searchResults,
        loading,
        error,
        actionLoadingId,
        debouncedQuery,
        handleSendRequest,
        handleAcceptRequest,
        handleStartChat,
    }
}
