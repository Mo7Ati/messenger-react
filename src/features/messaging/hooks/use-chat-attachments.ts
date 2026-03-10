import { useCallback, useEffect, useRef, useState } from "react"
import { validateAttachmentFile } from "@/features/messaging/messages-service"
import { toast } from "sonner"

export type UseChatAttachmentsOptions = {
  input: string
  isSending: boolean
  onSend: (files?: File[]) => Promise<void>
}

export function useChatAttachments({
  input,
  isSending,
  onSend,
}: UseChatAttachmentsOptions) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const filePreviewUrlsRef = useRef<Map<string, string>>(new Map())

  console.log("selectedFiles", selectedFiles)

  const getPreviewUrl = useCallback((file: File): string | null => {
    if (!file.type.startsWith("image/")) return null
    const key = `${file.name}-${file.size}-${file.lastModified}`
    let url = filePreviewUrlsRef.current.get(key)
    if (!url) {
      url = URL.createObjectURL(file)
      filePreviewUrlsRef.current.set(key, url)
    }
    return url
  }, [])

  useEffect(() => {
    const map = filePreviewUrlsRef.current
    const keys = new Set(selectedFiles.map((f) => `${f.name}-${f.size}-${f.lastModified}`))
    map.forEach((url, key) => {
      if (!keys.has(key)) {
        URL.revokeObjectURL(url)
        map.delete(key)
      }
    })
  }, [selectedFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ""
    const next: File[] = []
    for (const file of files) {
      const err = validateAttachmentFile(file)
      if (err) {
        toast.error(err)
        continue
      }
      next.push(file)
    }
    if (next.length) setSelectedFiles((prev) => [...prev, ...next])
  }, [])

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleSubmit = useCallback(async () => {
    const hasText = input.trim().length > 0
    const hasFiles = selectedFiles.length > 0
    if ((!hasText && !hasFiles) || isSending) return
    const filesToSend = hasFiles ? [...selectedFiles] : undefined
    await onSend(filesToSend)
    if (filesToSend) setSelectedFiles([])
  }, [input, selectedFiles, isSending, onSend])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    const next: File[] = []
    for (const file of files) {
      const err = validateAttachmentFile(file)
      if (err) {
        toast.error(err)
        continue
      }
      next.push(file)
    }
    if (next.length) setSelectedFiles((prev) => [...prev, ...next])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }, [])

  return {
    selectedFiles,
    getPreviewUrl,
    handleFileSelect,
    removeFile,
    handleSubmit,
    handleDrop,
    handleDragOver,
  }
}
