import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, Smile, X, FileText } from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { useChatInput, type SendMessagePayload } from "../../hooks/use-chat-input"

type ChatInputProps = {
    onSend: (payload: SendMessagePayload) => Promise<void> | void
    isSending?: boolean
    chatId?: number
}


export default function ChatInput({
    onSend,
    isSending = false,
    chatId,
}: ChatInputProps) {
    const {
        input,
        files,
        fileInputRef,
        canSend,
        ACCEPTED_FILE_TYPES,
        handleInputChange,
        openFilePicker,
        handleFileChange,
        removeFile,
        handleSubmit,
    } = useChatInput({
        onSend,
        isSending,
        chatId,
    })

    return (
        <div className="border-t bg-background px-4 py-3">
            {files.length > 0 && (
                <div className="mb-3 flex flex-col gap-2">
                    {files.map((file, index) => (
                        <div
                            key={`${file.name}-${file.size}-${index}`}
                            className="flex items-center gap-3 rounded-xl border bg-muted/40 px-3 py-2"
                        >
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
                                onClick={() => removeFile(index)}
                                disabled={isSending}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <form
                className="mx-auto flex min-w-0 items-center gap-2"
                onSubmit={handleSubmit}
            >
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground"
                    disabled={isSending}
                >
                    <Smile className="h-5 w-5" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-muted-foreground"
                    onClick={openFilePicker}
                    disabled={isSending}
                >
                    <Paperclip className="h-5 w-5" />
                </Button>

                <Input
                    placeholder="Type a message..."
                    value={input}
                    onChange={handleInputChange}
                    className="h-9 min-w-0 flex-1 border-0 bg-muted/50"
                    disabled={isSending}
                />

                <Button
                    type="submit"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    disabled={!canSend || isSending}
                >
                    <Send className="h-4 w-4" />
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_FILE_TYPES}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </form>
        </div>
    )
}