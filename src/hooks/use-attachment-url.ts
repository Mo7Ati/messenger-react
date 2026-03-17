import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { attachmentsService } from "@/services/attachments-service"

export function useAttachmentUrl(attachmentId: number) {
    const [blobUrl, setBlobUrl] = useState<string | null>(null)

    const { data: blob, isLoading, isError } = useQuery({
        queryKey: ["attachment-blob", attachmentId],
        queryFn: () => attachmentsService.fetchBlob(attachmentId),
        staleTime: Infinity,
    })

    useEffect(() => {
        if (!blob) return

        const url = URL.createObjectURL(blob)
        setBlobUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [blob])

    return { url: blobUrl, isLoading, isError }
}
