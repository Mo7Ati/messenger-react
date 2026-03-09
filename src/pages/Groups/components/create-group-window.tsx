import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MultiSelect } from "@/components/multi-select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { useCreateGroupForm } from "../hooks/use-create-group-form"

type CreateGroupWindowProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateGroupWindow({ isOpen, onClose }: CreateGroupWindowProps) {
  const {
    label,
    setLabel,
    selectedIds,
    setSelectedIds,
    participantOptions,
    isPending,
    handleSubmit,
  } = useCreateGroupForm(isOpen, onClose)

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

          <div className="space-y-4">
            <Label htmlFor="participants">Participants</Label>
            <MultiSelect
              options={participantOptions}
              onValueChange={setSelectedIds}
              placeholder="Select members"
              defaultValue={selectedIds}
              searchable
              className="w-full border border-input rounded-xl min-h-10"
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
              disabled={isPending}
            >
              {isPending ? "Creating…" : "Create group"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
