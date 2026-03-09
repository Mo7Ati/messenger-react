import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MultiSelect } from "@/components/multi-select"
import { useContacts } from "@/pages/Contacts/utils"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { groupsService } from "@/services/groups-service"
import { useQueryClient } from "@tanstack/react-query"
import { Label } from "@/components/ui/label"

type CreateGroupWindowProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateGroupWindow({ isOpen, onClose }: CreateGroupWindowProps) {
  const navigate = useNavigate()
  const { data: contactsResponse } = useContacts()
  const contacts = contactsResponse?.data ?? []
  const queryClient = useQueryClient()

  const [label, setLabel] = useState("")
  // const [avatarUrl, setAvatarUrl] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLabel("")
      // setAvatarUrl("")
      setSelectedIds([])
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

  const participantOptions = contacts.map((c) => ({
    label: c.name,
    value: String(c.id),
  }))

  const handleSubmit = async () => {
    const trimmedLabel = label.trim()
    if (!trimmedLabel) {
      toast.error("Enter a group name")
      return
    }
    if (selectedIds.length === 0) {
      toast.error("Select at least one member")
      return
    }

    setIsSubmitting(true)
    try {
      const created = await groupsService.createGroup({
        label: trimmedLabel,
        // avatar_url: avatarUrl.trim() || undefined,
        participants_ids: selectedIds.map(Number),
      })
      onClose()
      navigate(`/groups/${created.id}`)
      toast.success("Group created")
    } catch (err) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Failed to create group"
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-group-title"
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
        <div className="flex items-center justify-between shrink-0 border-b  px-4 py-3">
          <h2 id="create-group-title" className="text-lg font-semibold">
            New Group
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

        <div className="flex-1 min-h-0 flex flex-col gap-4 p-4 overflow-auto">
          <div className="space-y-4">
            <Label htmlFor="group-name">
              Group name
            </Label>
            <Input
              id="group-name"
              className="rounded-xl"
              placeholder="Group name"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              autoFocus
            />
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-medium">Group avatar</label>
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 shrink-0 rounded-full">
                <AvatarImage src={avatarUrl || undefined} alt={label || "Group"} />
                <AvatarFallback className="rounded-full text-sm">
                  {(label || "G").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Input
                className="rounded-xl flex-1 min-w-0"
                placeholder="Avatar URL (optional)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
          </div> */}

          <div className="space-y-4">
            <Label htmlFor="participants">Participants</Label>
            <MultiSelect
              options={participantOptions}
              onValueChange={setSelectedIds}
              placeholder="Select members"
              defaultValue={selectedIds}
              searchable
              className="w-full"
            />
          </div>

          <div className="flex gap-2 pt-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 rounded-xl"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create group"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
