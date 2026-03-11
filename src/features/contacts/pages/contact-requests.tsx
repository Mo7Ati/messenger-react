import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PendingRequest } from "@/types/contacts"
import { ArrowLeft, Inbox, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import type { User } from "@/types/general"
import { useContactRequests } from "../hooks/use-contact-requests"

function RequestRow({
  request,
  onAccept,
  onDecline,
  actionLoadingId,
  variant,
}: {
  request: User
  onAccept?: (r: PendingRequest) => void
  onDecline?: (r: PendingRequest) => void
  actionLoadingId: number | null
  variant: "received" | "sent"
}) {
  return (
    <li
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "border bg-card hover:bg-muted/30 transition-colors"
      )}
    >
      <Avatar className="h-12 w-12 shrink-0 rounded-full">
        <AvatarImage src={request.avatar_url} alt={request.username} />
        <AvatarFallback className="rounded-full text-sm">
          {request.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold truncate">{request.username}</p>
        {request.username && (
          <p className="text-xs text-muted-foreground truncate">@{request.username}</p>
        )}
      </div>
      {variant === "received" && onAccept && onDecline && (
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="default"
            className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onAccept({ user: request, id: request.id })}
            disabled={actionLoadingId === request.id}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="rounded-xl text-muted-foreground"
            onClick={() => onDecline({ user: request, id: request.id })}
            disabled={actionLoadingId === request.id}
          >
            Decline
          </Button>
        </div>
      )}
      {variant === "sent" && (
        <span className="text-xs text-muted-foreground shrink-0">Pending</span>
      )}
    </li>
  )
}

export function ContactRequests() {
  const {
    activeTab,
    setActiveTab,
    received,
    sent,
    loading,
    error,
    requests,
    actionLoadingId,
    handleAccept,
    handleDecline,
    refetchReceived,
  } = useContactRequests()

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 shrink-0 mb-4">
        <Button variant="ghost" size="icon" className="rounded-xl" asChild>
          <Link to="/contacts" aria-label="Back to contacts">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Contact Requests</h1>
      </div>

      <div className="flex shrink-0 border-b mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("received")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
            activeTab === "received"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Inbox className="h-4 w-4" />
          Received
          {received.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
              {received.length}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sent")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors",
            activeTab === "sent"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Send className="h-4 w-4" />
          Sent
          {sent.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-medium text-primary">
              {sent.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">{error.message}</p>
          <Button
            variant="outline"
            onClick={() => refetchReceived()}
            className="rounded-xl"
          >
            Try again
          </Button>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">
            {activeTab === "received"
              ? "No pending contact requests"
              : "No sent requests"}
          </p>
          <Button variant="outline" className="mt-4 rounded-xl" asChild>
            <Link to="/contacts">Back to Contacts</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {requests.map((request: User) => (
            <RequestRow
              key={request.id}
              request={request}
              variant={activeTab}
              onAccept={activeTab === "received" ? handleAccept : undefined}
              onDecline={activeTab === "received" ? handleDecline : undefined}
              actionLoadingId={actionLoadingId}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
