import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { X, FileText } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { PhotoView } from "react-image-previewer"

type FilePreviewItemProps = {
    file: File
    onRemove: () => void
    disabled?: boolean
}

export function FilePreviewItem({ file, onRemove, disabled }: FilePreviewItemProps) {
    const previewUrl = useMemo(() => {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
            return URL.createObjectURL(file)
        }
        return null
    }, [file])

    const isImage = file.type.startsWith("image/")
    const isVideo = file.type.startsWith("video/")

    if (isImage && previewUrl) {
        return (
            <div className="relative inline-block">
                <PhotoView src={previewUrl}>
                    <img
                        src={previewUrl}
                        alt={file.name}
                        className="h-20 max-w-40 cursor-pointer rounded-xl border object-cover"
                    />
                </PhotoView>
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-sm"
                    onClick={onRemove}
                    disabled={disabled}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    if (isVideo && previewUrl) {
        return (
            <div className="relative inline-block">
                <video
                    src={previewUrl}
                    className="h-20 max-w-40 rounded-xl border object-cover"
                />
                <Button
                    type="button"
                    size="icon"
                    variant="secondary"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full shadow-sm"
                    onClick={onRemove}
                    disabled={disabled}
                >
                    <X className="h-3 w-3" />
                </Button>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2">
            <div className="rounded-lg border bg-background p-2">
                <FileText className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                </p>
            </div>

            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 shrink-0"
                onClick={onRemove}
                disabled={disabled}
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
