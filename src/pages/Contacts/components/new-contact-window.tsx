import { useState, useEffect, useCallback } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserSearchItem } from "@/components/User/UserSearchItem"
import { contactService, type SearchUser } from "@/services/contacts-service"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type NewContactWindowProps = {
  isOpen: boolean
  onClose: () => void
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}

export function NewContactWindow({ isOpen, onClose }: NewContactWindowProps) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(searchQuery.trim(), 500)

  const fetchSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await contactService.searchUsers(query)
      setSearchResults(Array.isArray(data) ? data : [])
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Failed to search users"
      setError(message)
      setSearchResults([])
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      fetchSearch(debouncedQuery)
    } else {
      setSearchResults([])
      setError(null)
    }
  }, [debouncedQuery, fetchSearch])

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setSearchResults([])
      setError(null)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  const handleSendRequest = async (user: SearchUser) => {
    setActionLoadingId(user.id)
    try {
      await contactService.sendContactRequest(user.id)
      setSearchResults((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, contact_status: "request_sent" as const } : u
        )
      )
      toast.success("Contact request sent")
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Failed to send request"
      toast.error(message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleAcceptRequest = async (user: SearchUser) => {
    setActionLoadingId(user.id)
    try {
      await contactService.acceptContactRequest(user.id)
      setSearchResults((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, contact_status: "contacts" as const } : u
        )
      )
      toast.success("Contact added")
    } catch (err) {
      const message = err && typeof err === "object" && "message" in err
        ? String((err as { message: string }).message)
        : "Failed to accept request"
      toast.error(message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleStartChat = (user: SearchUser) => {
    onClose()
    navigate(`/contacts/${user.id}`, { state: { contact: user } })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-chat-title"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-md max-h-[85vh] flex flex-col",
          "rounded-2xl border bg-background shadow-xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between shrink-0 border-b px-4 py-3">
          <h2 id="new-chat-title" className="text-lg font-semibold">
            New Chat
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 min-h-0 flex flex-col p-4">
          <div className="relative shrink-0 mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9 rounded-xl"
              placeholder="Search by name or username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
          {searchQuery.length > 0 && searchQuery.length < 2 && (
            <p className="text-xs text-muted-foreground mb-2">
              Type at least 2 characters to search
            </p>
          )}
          <ScrollArea className="flex-1 min-h-0 -mx-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : error ? (
              <p className="text-sm text-destructive py-4 text-center">{error}</p>
            ) : searchResults.length === 0 && debouncedQuery.length >= 2 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                No users found
              </p>
            ) : (
              <ul className="space-y-1 pr-2">
                {searchResults.map((user) => (
                  <li key={user.id}>
                    <UserSearchItem
                      user={user}
                      onStartChat={handleStartChat}
                      onSendRequest={handleSendRequest}
                      onAcceptRequest={handleAcceptRequest}
                      disabled={actionLoadingId === user.id}
                    />
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
