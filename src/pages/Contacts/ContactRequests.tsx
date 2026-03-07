import { useState, useEffect } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { contactService, type PendingRequest } from "@/services/contacts-service"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function ContactRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await contactService.getPendingRequests()
      setRequests(Array.isArray(data) ? data : [])
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to load contact requests"
      setError(message)
      setRequests([])
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleAccept = async (request: PendingRequest) => {
    const userId = request.user?.id ?? request.id
    setActionLoadingId(userId)
    try {
      await contactService.acceptContactRequest(userId)
      setRequests((prev) => prev.filter((r) => (r.user?.id ?? r.id) !== userId))
      toast.success("Contact request accepted")
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to accept request"
      toast.error(message)
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleDecline = async (request: PendingRequest) => {
    const userId = request.user?.id ?? request.id
    setActionLoadingId(userId)
    try {
      await contactService.declineContactRequest(userId)
      setRequests((prev) => prev.filter((r) => (r.user?.id ?? r.id) !== userId))
      toast.success("Request declined")
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to decline request"
      toast.error(message)
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 shrink-0 mb-6">
        <Button variant="ghost" size="icon" className="rounded-xl" asChild>
          <Link to="/chats" aria-label="Back to chats">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-xl font-semibold">Contact Requests</h1>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={fetchRequests} className="rounded-xl">
            Try again
          </Button>
        </div>
      ) : requests.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-sm">No pending contact requests</p>
          <Button variant="outline" className="mt-4 rounded-xl" asChild>
            <Link to="/chats">Back to Chats</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {requests.map((request) => {
            const user = request.user
            const id = user?.id ?? request.id
            const name = user?.name ?? "Unknown"
            const username = user?.username
            const avatarUrl = user?.avatar_url ?? user?.avatar
            const isDisabled = actionLoadingId === id

            return (
              <li
                key={request.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl",
                  "border bg-card hover:bg-muted/30 transition-colors"
                )}
              >
                <Avatar className="h-12 w-12 shrink-0 rounded-full">
                  <AvatarImage src={avatarUrl} alt={name} />
                  <AvatarFallback className="rounded-full text-sm">
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{name}</p>
                  {username && (
                    <p className="text-xs text-muted-foreground truncate">
                      @{username}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="default"
                    className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAccept(request)}
                    disabled={isDisabled}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="rounded-xl text-muted-foreground"
                    onClick={() => handleDecline(request)}
                    disabled={isDisabled}
                  >
                    Decline
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
