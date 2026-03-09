import { useCallback, useEffect, useMemo, useState } from "react"
import api from "@/lib/api"
import { toast } from "sonner"
import type { Chat, Message, User } from "@/types/general"
import { useMessengerInbox } from "@/contexts/messenger-inbox-context"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/pages/Chats/utils"
import { useContact } from "@/pages/Contacts/utils"
import { useQueryClient } from "@tanstack/react-query"

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
  const queryClient = useQueryClient()


  const chatId = args.mode === "chat" ? args.chatId : undefined
  const contactId = args.mode === "contact" ? args.contactId : undefined

  const { user: currentUser } = useAuth()
  const { setActiveConversation } = useMessengerInbox()
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
  }, [resolved.chatId, resolved.contactId, resolved.initialMessages])

  // Register with inbox so MessageCreated for this conversation appends here.
  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev
      return [...prev, message]
    })
  }, [])

  useEffect(() => {
    setActiveConversation(resolved.chatId, appendMessage)
    return () => setActiveConversation(undefined, (_msg: Message) => { })
  }, [resolved.chatId, appendMessage, setActiveConversation])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const onSend = async () => {
    const text = input.trim()
    if (!text || isSending) return

    const pendingId = "pending-" + Date.now()

    const optimisticMessage: Message = {
      id: pendingId,
      body: text,
      user_id: currentUser?.id ?? 0,
      is_read_by_all: false,
      is_mine: true,
      created_at: new Date().toISOString(),
      user: currentUser
        ? {
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          email: currentUser.email,
          avatar_url: currentUser.avatar_url,
          bio: currentUser.bio,
          last_active_at: currentUser.last_active_at,
        }
        : ({} as User),
    }
    setMessages((prev) => [...prev, optimisticMessage])
    setInput("")
    setIsSending(true)

    try {
      let newMessage: Message

      const isExistingChatSend = args.mode === "chat" || (args.mode === "contact" && !!resolved.chatId)

      if (isExistingChatSend) {
        if (!resolved.chatId) {
          throw new Error("Missing chatId for chat send")
        }
        const { data } = await api.post<Message>("/messages", {
          message: text,
          conversation_id: resolved.chatId,
        })
        newMessage = data
      } else {
        if (!resolved.contactId) {
          throw new Error("Missing contactId for first contact send")
        }
        const { data } = await api.post<Message>("/messages", {
          message: text,
          user_id: resolved.contactId,
        })
        newMessage = data
      }

      if (args.mode === "contact" && !resolved.chatId && newMessage.chat_id) {
        resolved.chatId = newMessage.chat_id;
        resolved.initialMessages = [...resolved.initialMessages, newMessage];
      }

      syncChatsList(newMessage);

      setMessages((prev) =>
        prev.map((m) => (m.id === pendingId ? newMessage : m))
      )
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== pendingId))
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  const syncChatsList = useCallback((message: Message) => {
    queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
      if (!chats) return chats
      return chats.map(c => {
        if (c.id === message.chat_id) {
          return {
            ...c,
            last_message: message,
            new_messages: 0,
          }
        }
        return c;
      })
    })
  }, [queryClient])

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