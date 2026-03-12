import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/api"
import { useContact } from "./use-contacts-queries"
import type { Chat, Message } from "@/types/general"
import type { GetContactResponse } from "@/types/contacts"
import { updateChatLastMessage } from "@/lib/use-cache"

const useContactScreen = () => {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isSending, setIsSending] = useState(false)

  const { data, isFetching } = useContact(Number(contactId))

  const onBack = () => navigate("/contacts")

  const handleSend = async ({ body, files }: { body: string; files: File[] }) => {
    try {
      setIsSending(true)

      const formData = new FormData()

      if (data?.chat?.id) {
        formData.append("chat_id", String(data.chat.id))
      } else if (data?.contact?.id) {
        formData.append("user_id", String(data.contact.id))
      } else {
        toast.error("Failed to send message. Please try again.")
        return
      }

      if (body) {
        formData.append("message", body)
      }

      files.forEach((file) => {
        formData.append("attachments[]", file)
      })

      const { data: sentMessage } = await api.post<Message>("/messages", formData)

      // Update the contact detail cache
      queryClient.setQueryData<GetContactResponse>(["contact", Number(contactId)], (prev) => {
        if (!prev) return prev

        const chat: Chat = prev.chat
          ? {
            ...prev.chat,
            messages: [...(prev.chat.messages ?? []), sentMessage],
            last_message: sentMessage,
          }
          : {
            id: sentMessage.chat_id ?? 0,
            label: prev.contact.username,
            type: "peer",
            last_message: sentMessage,
            messages: [sentMessage],
            new_messages: 0,
            created_at: sentMessage.created_at,
            participants: [prev.contact],
          }

        return {
          ...prev,
          chat,
        }
      })

    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return {
    contactId,
    participants: data?.contact ? [data.contact] : [],
    title: data?.contact?.username ?? "Contact",
    messages: data?.chat?.messages ?? [],
    isFetching,
    isSending,
    onBack,
    handleSend,
  }
}

export default useContactScreen

