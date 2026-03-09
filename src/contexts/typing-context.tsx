import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import type { User } from "@/types/general"
import { useAuth } from "@/contexts/auth-context"
import { usePublicChannel } from "@/hooks/use-public-channel"

const TYPING_EXPIRY_MS = 4000

type TypingEntry = { user: User; expiresAt: number }

type TypingState = Record<number, TypingEntry[]>

type TypingContextValue = {
  getTypingUsers: (chatId: number) => User[]
}

const TypingContext = createContext<TypingContextValue | null>(null)

export function TypingProvider({ children }: { children: ReactNode }) {
  const { user: currentUser } = useAuth()
  const { channel } = usePublicChannel()
  const [typingByChatId, setTypingByChatId] = useState<TypingState>({})
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const timerKey = (chatId: number, userId: number) => `${chatId}:${userId}`

  useEffect(() => {
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
            const { [chatId]: _, ...rest } = next
            return rest
          }
          return next
        })
      }, TYPING_EXPIRY_MS)
      timersRef.current.set(key, timer)
    }

    channel.listenForWhisper("typing", handleTyping)


    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
      timersRef.current.clear()
    }
  }, [channel])

  const getTypingUsers = useCallback(
    (chatId: number): User[] => {
      const now = Date.now()
      const entries = (typingByChatId[chatId] ?? []).filter((e) => e.expiresAt > now)
      const users = entries.map((e) => e.user)
      if (!currentUser?.id) return users
      return users.filter((u) => u.id !== currentUser.id)
    },
    [typingByChatId, currentUser?.id]
  )

  const value: TypingContextValue = { getTypingUsers }

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
