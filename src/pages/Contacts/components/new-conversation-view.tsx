import { useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router"
import type { Message, User } from "@/types/general"
import api from "@/lib/api"
import { toast } from "sonner"
import { ChatWindow } from "../../../components/chat-window"

type LocationState = {
  user?: User
}

const NewConversationView = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const location = useLocation()
  const state = location.state as LocationState | null

  const targetUser = state?.user ?? null
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  const numericUserId = Number(userId)

  const handleSend = async () => {
    const text = input.trim()
    if (!text || !numericUserId) return

    try {
      const { data } = await api.post<Message>("/messages", {
        user_id: numericUserId,
        message: text,
      })

      setMessages((prev) => [...prev, data])
      setInput("")

      const conversationId = (data as Message & { conversation_id?: number }).conversation_id
      if (conversationId) {
        navigate(`/chats/${conversationId}`)
      }
    } catch {
      toast.error("Failed to send message")
    }
  }

  if (!targetUser) {
    return <div>Loading conversation...</div>
  }

  return (
    <ChatWindow
      participants={[targetUser]}
      label={targetUser.name}
      messages={messages}
      input={input}
      isLoading={false}
      onBack={() => navigate("/chats")}
      onInputChange={(e) => setInput(e.target.value)}
      onSend={() => {
        void handleSend()
      }}
    />
  )
}

export default NewConversationView

