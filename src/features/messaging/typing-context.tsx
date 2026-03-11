/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { ConversationType, User } from "@/types/general"
import { useAuth } from "@/features/auth/auth-context"
import { usePublicChannel } from "@/features/messaging/hooks/use-public-channel"

const TYPING_EXPIRY_MS = 2000

type TypingEntry = { user: User; expiresAt: number }

type TypingState = Record<number, TypingEntry[]>

type TypingContextValue = {
  getTypingLabel: (chatId: number, chatType: ConversationType) => string
}

const TypingContext = createContext<TypingContextValue | null>(null)

export function TypingProvider({ children }: { children: ReactNode }) {
  const { user: currentUser } = useAuth()
  const { channel } = usePublicChannel()
  const [typingByChatId, setTypingByChatId] = useState<TypingState>({})
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const timerKey = (chatId: number, userId: number) => `${chatId}:${userId}`

  useEffect(() => {
    const timers = timersRef.current

    const handleTyping = (payload: { user: User; chatId: number }) => {
      const { user, chatId } = payload
      if (!user?.id || chatId == null) return

      const key = timerKey(chatId, user.id)
      const existing = timersRef.current.get(key)
      if (existing) clearTimeout(existing)

      const expiresAt = Date.now() + TYPING_EXPIRY_MS
      setTypingByChatId((prev) => {
        const list = (prev[chatId] ?? []).filter((e) => e.user.id !== user.id)
        return { ...prev, [chatId]: [...list, { user, expiresAt }] }
      })

      const timer = setTimeout(() => {
        timersRef.current.delete(key)
        setTypingByChatId((prev) => {
          const list = (prev[chatId] ?? []).filter((e) => e.user.id !== user.id)
          const next = { ...prev, [chatId]: list }
          if (list.length === 0) {
            const rest = { ...next }
            delete rest[chatId]
            return rest
          }
          return next
        })
      }, TYPING_EXPIRY_MS)
      timersRef.current.set(key, timer)
    }

    channel.listenForWhisper("typing", handleTyping)

    return () => {
      timers.forEach((t) => clearTimeout(t))
      timers.clear()
    }
  }, [channel])

  const getTypingUsers = (chatId: number): User[] => {
    const now = Date.now()
    const entries = (typingByChatId[chatId] ?? []).filter((e) => e.expiresAt > now)
    const users = entries.map((e) => e.user)
    if (!currentUser?.id) return users
    return users.filter((u) => u.id !== currentUser.id)
  }

  const getTypingLabel = (chatId: number, chatType: ConversationType): string => {
    const typingUsers = getTypingUsers(chatId)
    if (typingUsers.length === 0) return ""
    if (chatType === "peer") return "typing..."
    return typingUsers.length === 1
      ? `${typingUsers[0].username} is typing`
      : `${typingUsers[0].username} and ${typingUsers.length - 1} others are typing`
  }

  const value: TypingContextValue = { getTypingLabel }

  return (
    <TypingContext.Provider value={value}>
      {children}
    </TypingContext.Provider>
  )
}

export function useTyping(): TypingContextValue {
  const ctx = useContext(TypingContext)
  if (!ctx) {
    throw new Error("useTyping must be used within TypingProvider")
  }
  return ctx
}
