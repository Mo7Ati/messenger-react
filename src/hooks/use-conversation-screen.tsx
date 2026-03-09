import { useCallback, useRef, useState } from "react"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"
import type { Message, User } from "@/types/general"
import { messagesService } from "@/services/messages-service"
import { updateChatLastMessage } from "@/lib/chat-cache"
import { useConversationData, type ConversationArgs } from "./use-conversation-data"
import { useConversationMessages } from "./use-conversation-messages"
import { useConversationRealtime } from "./use-conversation-realtime"
import { useConversationInput } from "./use-conversation-input"

type UseConversationScreenReturn = {
  chatId: number | undefined
  title: string
  participants: User[]
  isGroupChat: boolean
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
  const queryClient = useQueryClient()
  const [isSending, setIsSending] = useState(false)

  const resolved = useConversationData(args)
  const resolvedRef = useRef(resolved)
  resolvedRef.current = resolved

  const {
    messages,
    appendMessage,
    addOptimistic,
    replaceOptimistic,
    removeOptimistic
  } = useConversationMessages(resolved.chatId, resolved.contactId, resolved.initialMessages)

  useConversationRealtime(resolved.chatId, appendMessage)

  const {
    input,
    onInputChange,
    clearInput,
    currentUser
  } = useConversationInput(resolved.chatId)

  const onSend = useCallback(async () => {
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

    addOptimistic(optimisticMessage)
    clearInput()
    setIsSending(true)

    try {
      const { chatId, contactId } = resolvedRef.current
      const isExistingChatSend = args.mode === "chat" || (args.mode === "contact" && !!chatId)

      let newMessage: Message

      if (isExistingChatSend) {
        if (!chatId) throw new Error("Missing chatId for chat send")
        newMessage = await messagesService.sendToConversation({
          message: text,
          conversation_id: chatId,
        })
      } else {
        if (!contactId) throw new Error("Missing contactId for first contact send")
        newMessage = await messagesService.sendToUser({
          message: text,
          user_id: contactId,
        })
      }

      updateChatLastMessage(queryClient, newMessage)
      replaceOptimistic(pendingId, newMessage)
    } catch {
      removeOptimistic(pendingId)
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }, [input, isSending, currentUser, args.mode, queryClient, addOptimistic, clearInput, replaceOptimistic, removeOptimistic])

  return {
    chatId: resolved.chatId,
    title: resolved.title,
    participants: resolved.participants,
    isGroupChat: resolved.conversationType === "group",
    messages,
    input,
    isLoading: resolved.isLoading,
    isSending,
    onInputChange,
    onSend,
  }
}
