/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Message } from "@/types/general"
import type { MessageCreatedPayload } from "@/features/messaging/hooks/use-user-inbox-channel"
import { syncIncomingMessage } from "@/lib/chat-cache"
import { playNotificationSound } from "@/lib/utils"



type AppendMessageFn = (message: Message) => void

type MessengerInboxContextValue = {
  setActiveConversation: (
    conversationId: number | undefined,
    appendMessage: AppendMessageFn
  ) => void
  onMessageReceived: (payload: MessageCreatedPayload) => void,
}

const MessengerInboxContext = createContext<MessengerInboxContextValue | null>(
  null
)

export function MessengerInboxProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const activeConversationIdRef = useRef<number | undefined>(undefined)
  const appendMessageRef = useRef<AppendMessageFn | null>(null)

  const setActiveConversation = useCallback(
    (conversationId: number | undefined, appendMessage: AppendMessageFn) => {
      activeConversationIdRef.current = conversationId
      appendMessageRef.current = appendMessage
    }, [])

  const onMessageReceived = useCallback(
    (payload: MessageCreatedPayload) => {
      const incomingMessage = payload.message
      const chatId = incomingMessage.chat_id

      syncIncomingMessage(queryClient, incomingMessage)

      const isForActiveChat = activeConversationIdRef.current && activeConversationIdRef.current === chatId
      if (isForActiveChat && appendMessageRef.current) {
        appendMessageRef.current(incomingMessage)
      } else {
        const fromName = incomingMessage.user?.username ?? "Someone"
        playNotificationSound()
        toast.info(`${fromName} : ${incomingMessage.type === "text" ? incomingMessage.body : "Attachment"}`, { position: "top-right" })
      }
    },
    [queryClient]
  )

  const value: MessengerInboxContextValue = {
    setActiveConversation,
    onMessageReceived,
  }

  return (
    <MessengerInboxContext.Provider value={value}>
      {children}
    </MessengerInboxContext.Provider>
  )
}

export function useMessengerInbox(): MessengerInboxContextValue {
  const ctx = useContext(MessengerInboxContext)
  if (!ctx)
    throw new Error("useMessengerInbox must be used within MessengerInboxProvider")
  return ctx
}
