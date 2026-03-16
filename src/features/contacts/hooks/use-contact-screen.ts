import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import api from "@/lib/api"
import { useContact } from "./use-contacts-queries"
import type { Message } from "@/types/general"
import useUpdateCache from "@/hooks/use-update-cache"


const useContactScreen = () => {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()
  const [isSending, setIsSending] = useState(false)
  const { syncMessage } = useUpdateCache()
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

      syncMessage(sentMessage, data.contact)

    } catch (error) {
      console.log("error", error);
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
    chatId: data?.chat?.id,
    typingLabel: data?.chat?.typing_label ?? "",
    newMessages: data?.chat?.new_messages ?? 0,
    isFetching,
    isSending,
    onBack,
    handleSend,
  }
}

export default useContactScreen

