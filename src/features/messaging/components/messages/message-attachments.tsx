import type { Attachment } from "@/types/general"
import { MessageAttachmentItem } from "./message-attachment-item"

type MessageAttachmentsProps = {
    attachments: Attachment[]
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
    return (
        <div className="flex flex-col gap-2">
            {attachments.map((attachment) => (
                <MessageAttachmentItem key={attachment.id} attachment={attachment} />
            ))}
        </div>
    )
}