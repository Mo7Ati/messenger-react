import { useEffect, useMemo, useState } from "react"
import api from "@/lib/api"
import { toast } from "sonner"
import type { Message, User } from "@/types/general"
import { useConversationChannel } from "@/hooks/use-conversation-channel"
import { useChat } from "@/pages/Chats/utils"
import { useContact } from "@/pages/Contacts/utils"

type ConversationArgs =
  | { mode: "chat"; chatId: number }
  | { mode: "contact"; contactId: number }


type UseConversationScreenReturn = {
  title: string
  participants: User[]
  messages: Message[]
  input: string
  isLoading: boolean
  isSending: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => Promise<void>
}

export const useConversationScreen = (
  args: ConversationArgs
): UseConversationScreenReturn => {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isSending, setIsSending] = useState(false)

  const chatId = args.mode === "chat" ? args.chatId : undefined
  const contactId = args.mode === "contact" ? args.contactId : undefined

  const chatQuery = useChat(Number(chatId), args.mode === "chat")
  const contactQuery = useContact(Number(contactId), args.mode === "contact")

  const resolved = useMemo(() => {
    if (args.mode === "chat") {
      const chat = chatQuery.data

      return {
        type: "chat",
        chatId: chat?.id,
        title: chat?.label ?? "",
        participants: chat?.participants ?? [],
        initialMessages: chat?.messages ?? [],
        isLoading: chatQuery.isLoading,
        exists: !!chat,
      }
    }

    const data = contactQuery.data

    return {
      type: "contact",
      chatId: data?.chat?.id,
      contactId: data?.contact?.id,
      title: data?.contact?.name ?? "",
      participants: data?.contact ? [data.contact] : [],
      initialMessages: data?.chat?.messages ?? [],
      isLoading: contactQuery.isLoading || contactQuery.isPending,
      exists: !!data?.contact,
    }
  }, [
    args.mode,
    chatQuery.data,
    chatQuery.isLoading,
    contactQuery.data,
    contactQuery.isLoading,
    contactQuery.isPending,
  ])

  // Initialize local messages only when the active conversation changes.
  useEffect(() => {
    setMessages(resolved.initialMessages)
  }, [resolved.chatId, resolved.contactId])

  // Subscribe only when we have a real chat id.
  useConversationChannel(Number(resolved.chatId), setMessages)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onSend = async () => {
    const text = input.trim()
    if (!text || isSending) return

    try {
      setIsSending(true)

      const { data: newMessage } = await api.post<Message>("/messages", {
        conversation_id: args.mode === "chat" ? resolved.chatId : undefined,
        user_id: args.mode === "contact" ? resolved.contactId : undefined,
        message: text,
      })

      setMessages((prev) => [...prev, newMessage])
      setInput("")

    } catch {
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  return {
    title: resolved.title,
    participants: resolved.participants,
    messages,
    input,
    isLoading: resolved.isLoading,
    isSending,
    onInputChange,
    onSend,
  }
}