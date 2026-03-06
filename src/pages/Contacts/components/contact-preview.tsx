import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import type { Message } from "@/types/general"
import { ChatWindow } from "../../../components/chat-window"
import { useContact } from "../utils"
import { useConversationChannel } from "@/pages/Chats/use-conversation-channel"


const ContactPreview = () => {
  const navigate = useNavigate()
  const { contactId } = useParams<{ contactId: string }>()

  const { data, isLoading, isPending, isError } = useContact(Number(contactId))
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    if (data && data.chat && data.chat.messages) {
      setMessages(data.chat.messages)
    }
  }, [data?.chat, data?.chat?.messages])

  useConversationChannel(Number(contactId), setMessages)

  if (isPending) {
    return <div>Loading contact...</div>
  }

  if (isError) {
    return <div>Error loading contact</div>
  }

  // const handleSend = async () => {
  //   const text = input.trim()
  //   if (!text || !numericUserId) return

  //   try {
  //     const { data } = await api.post<Message>("/messages", {
  //       user_id: numericUserId,
  //       message: text,
  //     })

  //     setMessages((prev) => [...prev, data])
  //     setInput("")

  //     const conversationId = (data as Message & { conversation_id?: number }).conversation_id
  //     if (conversationId) {
  //       navigate(`/chats/${conversationId}`)
  //     }
  //   } catch {
  //     toast.error("Failed to send message")
  //   }
  // }

  // if (!chat) {
  //   return <div>Loading conversation...</div>
  // }

  return (
    <ChatWindow
      participants={[data.contact]}
      label={data.contact.name}
      messages={messages}
      input={input}
      isLoading={false}
      onBack={() => navigate("/contacts")}
      onInputChange={() => { }}
      onSend={() => { }}
    />
  )
}

export default ContactPreview

