import {
  createContext,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Chat, Message } from "@/types/general"
import type { MessageCreatedPayload } from "@/hooks/use-user-inbox-channel"

type AppendMessageFn = (message: Message) => void

type MessengerInboxContextValue = {
  /** Register the currently open conversation so incoming messages can be routed. */
  setActiveConversation: (
    conversationId: number | undefined,
    appendMessage: AppendMessageFn
  ) => void
  /** Called by the user inbox channel when MessageCreated is received. */
  onMessageReceived: (payload: MessageCreatedPayload) => void
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
      const chatId = payload.message.chat_id;

      const isForActiveChat = activeConversationIdRef.current && activeConversationIdRef.current === chatId
      const incomingMessage = payload.message

      syncChatsList(incomingMessage);

      if (isForActiveChat && appendMessageRef.current) {
        appendMessageRef.current(incomingMessage)
      } else {
        const fromName = incomingMessage.user?.name ?? "Someone"
        toast.info(`New message from ${fromName}`, { position: "top-right" })
      }
    },
    [queryClient]
  )

  const syncChatsList = (incomingMessage: Message) => {
    queryClient.setQueryData<Chat[]>(["chats"], (chats) => {
      if (!chats) return chats
      if (chats.length === 0) {
        const chat: Chat = {
          id: incomingMessage.chat_id ?? 0,
          label: incomingMessage.user.name ?? "unknown",
          type: "peer",
          last_message: incomingMessage,
          messages: [incomingMessage],
          new_messages: 1,
          created_at: incomingMessage.created_at,
          participants: [incomingMessage.user],
        }
        return [chat]
      }

      return chats.map((chat) => {
        if (chat.id === incomingMessage.chat_id) {
          return {
            ...chat,
            last_message: incomingMessage,
            new_messages: incomingMessage.is_mine ? chat.new_messages : chat.new_messages + 1,
          }
        }
        return chat
      })
    })
  }

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
