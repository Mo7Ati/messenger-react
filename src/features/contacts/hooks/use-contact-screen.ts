import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import api from "@/lib/api"
import { useContact } from "./use-contacts-queries"
import type { Message } from "@/types/general"
import useUpdateCache from "@/hooks/use-update-cache"
import useMessengerChannel from "@/hooks/use-messenger-channel"
import { useUser } from "@/features/auth/auth-context"


const useContactScreen = () => {
  const { contactId } = useParams<{ contactId: string }>()
  const numericContactId = Number(contactId)
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)
  const { syncMessage, makeAsRead } = useUpdateCache()
  const messengerChannel = useMessengerChannel()
  const user = useUser()
  const { data, isFetching } = useContact(numericContactId)
  const chatId = data?.chat?.id

  const whisperRead = (chatId: number) => {
    messengerChannel().whisper("read", { chat_id: chatId, user_id: user.id })
  }

  useEffect(() => {
    if (isFetching || !chatId || !data?.chat || data.chat.new_messages === 0) return
    makeAsRead(chatId, numericContactId)
    whisperRead(chatId)
  }, [chatId, isFetching])

  const handleInputFocus = () => {
    if (chatId && data?.chat && data.chat.new_messages > 0) {
      makeAsRead(chatId, numericContactId)
      whisperRead(chatId)
    }
  }

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

      syncMessage(sentMessage, data.contact)

    } catch (error) {
      console.log("error", error);
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  return {
    contactId: numericContactId,
    participants: data?.contact ? [data.contact] : [],
    title: data?.contact?.username ?? "Contact",
    messages: data?.chat?.messages ?? [],
    chatId,
    typingLabel: data?.chat?.typing_label ?? "",
    newMessages: data?.chat?.new_messages ?? 0,
    isFetching,
    isSending,
    onBack,
    handleSend,
    handleInputFocus,
  }
}

export default useContactScreen

