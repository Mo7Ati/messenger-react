import { useEffect } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserSearchItem } from "@/components/User/UserSearchItem"
import { cn } from "@/lib/utils"
import { useNewContactSearch } from "../hooks/use-new-contact-search"

type NewContactWindowProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewContactWindow({ isOpen, onClose }: NewContactWindowProps) {
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading,
    error,
    actionLoadingId,
    debouncedQuery,
    handleSendRequest,
    handleAcceptRequest,
    handleStartChat,
  } = useNewContactSearch(isOpen, onClose)

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
