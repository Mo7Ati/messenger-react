import { useRef, useState } from "react"

export type SendMessagePayload = {
    body: string
    files: File[]
}

type UseChatInputOptions = {
    onSend: (payload: SendMessagePayload) => Promise<void> | void
    isSending?: boolean
}

export function useChatInput({
    onSend,
    isSending = false,
}: UseChatInputOptions) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const ACCEPTED_FILE_TYPES =
        "image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,application/zip,audio/mpeg,video/mp4,audio/wav"

    const [input, setInput] = useState("")
    const [files, setFiles] = useState<File[]>([])

    const openFilePicker = () => {
        if (isSending) return
        fileInputRef.current?.click()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? [])
        if (!selectedFiles.length) return

        setFiles((prev) => {
            const existing = new Set(prev.map((file) => `${file.name}-${file.size}`))
            const unique = selectedFiles.filter(
                (file) => !existing.has(`${file.name}-${file.size}`)
            )
            return [...prev, ...unique]
        })

        e.target.value = ""
    }

    const removeFile = (index: number) => {
        if (isSending) return
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const reset = () => {
        setInput("")
        setFiles([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const canSend = !!input.trim() || files.length > 0

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const body = input.trim()
        if (!body && files.length === 0) return
        if (isSending) return

        await onSend({ body, files })
        reset()
    }

    return {
        input,
        files,
        fileInputRef,
        canSend,
        ACCEPTED_FILE_TYPES,
        setInput,
        openFilePicker,
        handleFileChange,
        removeFile,
        handleSubmit,
        reset,
    }
}