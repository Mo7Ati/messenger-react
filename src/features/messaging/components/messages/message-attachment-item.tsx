import { FileText, Download } from "lucide-react"
import type { Attachment } from "@/types/general"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/utils"
import { useAttachmentUrl } from "@/hooks/use-attachment-url"
import { Skeleton } from "@/components/ui/skeleton"

type MessageAttachmentItemProps = {
    attachment: Attachment
}

export function MessageAttachmentItem({
    attachment,
}: MessageAttachmentItemProps) {
    const { url, isLoading } = useAttachmentUrl(attachment.id)
    const isImage = attachment.mime_type.startsWith("image/")
    const isVideo = attachment.mime_type.startsWith("video/")

    if (isImage) {
        if (isLoading || !url) {
            return <Skeleton className="h-48 w-full rounded-xl" />
        }

        return (
            <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border"
            >
                <img
                    src={url}
                    alt={attachment.original_name}
                    className="max-h-80 w-full object-cover"
                />
            </a>
        )
    }

    if (isVideo) {
        if (isLoading || !url) {
            return <Skeleton className="h-48 w-full rounded-xl" />
        }

        return (
            <video
                controls
                className="max-h-80 w-full rounded-xl border"
                src={url}
            />
        )
    }

    const handleDownload = () => {
        if (!url) return
        const a = document.createElement("a")
        a.href = url
        a.download = attachment.original_name
        a.click()
    }

    return (
        <div className="flex items-center gap-3 rounded-xl border bg-background/60 p-3 text-foreground">
            <div className="rounded-lg border p-2">
                <FileText className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.original_name}</p>
                {attachment.size ? (
                    <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                    </p>
                ) : null}
            </div>

            <Button
                size="icon"
                variant="ghost"
                onClick={handleDownload}
                disabled={isLoading || !url}
            >
                <Download className="h-4 w-4" />
            </Button>
        </div>
    )
}
