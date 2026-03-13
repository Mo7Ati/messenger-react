import { FileText, Image as ImageIcon, Download } from "lucide-react"
import type { Attachment } from "@/types/general"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/utils"

type MessageAttachmentItemProps = {
    attachment: Attachment
}

export function MessageAttachmentItem({
    attachment,
}: MessageAttachmentItemProps) {
    const isImage = attachment.mime_type.startsWith("image/")
    const isVideo = attachment.mime_type.startsWith("video/")

    if (isImage) {
        return (
            <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border"
            >
                <img
                    src={attachment.url}
                    alt={attachment.original_name}
                    className="max-h-80 w-full object-cover"
                />
            </a>
        )
    }

    if (isVideo) {
        return (
            <video
                controls
                className="max-h-80 w-full rounded-xl border"
                src={attachment.url}
            />
        )
    }

    return (
        <div className="flex items-center gap-3 rounded-xl border bg-background/60 p-3 text-foreground">
            <div className="rounded-lg border p-2">
                {isImage ? <ImageIcon className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{attachment.original_name}</p>
                {attachment.size ? (
                    <p className="text-xs text-muted-foreground">
                        {formatFileSize(attachment.size)}
                    </p>
                ) : null}
            </div>

            <Button asChild size="icon" variant="ghost">
                <a href={attachment.url} target="_blank" rel="noreferrer">
                    <Download className="h-4 w-4" />
                </a>
            </Button>
        </div>
    )
}