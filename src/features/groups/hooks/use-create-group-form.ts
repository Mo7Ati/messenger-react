import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useContacts } from "@/features/contacts/hooks/use-contacts-queries"
import { useCreateChat } from "@/hooks/use-chats-queries"
import type { Chat } from "@/types/general"
import { useQueryClient } from "@tanstack/react-query"
import useUpdateCache from "@/hooks/use-update-cache"

export function useCreateGroupForm(isOpen: boolean, onClose: () => void) {
    const navigate = useNavigate()
    const { data: contactsResponse } = useContacts()
    const contacts = useMemo(() => contactsResponse?.data ?? [], [contactsResponse?.data])
    const createChat = useCreateChat()

    const [label, setLabel] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const { appendGroupToGroupsList } = useUpdateCache();


    useEffect(() => {
        if (!isOpen) {
            setLabel("")
            setSelectedIds([])
        }
    }, [isOpen])

    const participantOptions = useMemo(
        () => contacts.map((c) => ({ label: c.username, value: String(c.id) })),
        [contacts]
    )

    const handleSubmit = () => {
        const trimmedLabel = label.trim()
        if (!trimmedLabel) {
            toast.error("Enter a group name")
            return
        }
        if (selectedIds.length === 0) {
            toast.error("Select at least one member")
            return
        }

        createChat.mutate(
            {
                label: trimmedLabel,
                participants_ids: selectedIds.map(Number),
            },
            {
                onSuccess: (created) => {
                    onClose()
                    navigate(`/groups/${created.id}`)
                    appendGroupToGroupsList(created)
                    toast.success("Group created")
                },
                onError: (err) => {
                    const message =
                        err && typeof err === "object" && "message" in err
                            ? String((err as { message: string }).message)
                            : "Failed to create group"
                    toast.error(message)
                },
            }
        )
    }

    return {
        label,
        setLabel,
        selectedIds,
        setSelectedIds,
        participantOptions,
        isPending: createChat.isPending,
        handleSubmit,
    }
}
