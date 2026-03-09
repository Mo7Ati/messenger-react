import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useContacts } from "@/pages/Contacts/hooks/use-contacts-queries"
import { useCreateGroup } from "./use-groups-queries"

export function useCreateGroupForm(isOpen: boolean, onClose: () => void) {
    const navigate = useNavigate()
    const { data: contactsResponse } = useContacts()
    const contacts = contactsResponse?.data ?? []
    const createGroup = useCreateGroup()

    const [label, setLabel] = useState("")
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    useEffect(() => {
        if (!isOpen) {
            setLabel("")
            setSelectedIds([])
        }
    }, [isOpen])

    const participantOptions = useMemo(
        () => contacts.map((c) => ({ label: c.name, value: String(c.id) })),
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

        createGroup.mutate(
            {
                label: trimmedLabel,
                participants_ids: selectedIds.map(Number),
            },
            {
                onSuccess: (created) => {
                    onClose()
                    navigate(`/groups/${created.id}`)
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
        isPending: createGroup.isPending,
        handleSubmit,
    }
}
