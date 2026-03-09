import { useState } from "react"
import { echo } from "@laravel/echo-react"
import { useAuth } from "@/contexts/auth-context"
import type { User } from "@/types/general"

export function useConversationInput(participants: User[]) {
    const [input, setInput] = useState("")
    const { user: currentUser } = useAuth()

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        participants.forEach((participant) => {
            echo().private(`messenger.user.${participant.id}`).whisper("typing", {
                user: currentUser,
            })
        })
        setInput(e.target.value)
    }

    const clearInput = () => setInput("")

    return { input, onInputChange, clearInput, currentUser }
}
