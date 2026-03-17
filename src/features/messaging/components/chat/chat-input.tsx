import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Paperclip, Send, Smile } from "lucide-react"
import { useChatInput, type SendMessagePayload } from "../../hooks/use-chat-input"
import { PhotoProvider } from "react-image-previewer"
import { FilePreviewItem } from "./file-preview-item"

type ChatInputProps = {
    onSend: (payload: SendMessagePayload) => Promise<void> | void
    isSending?: boolean
    chatId?: number
    onFocus?: () => void
}


export default function ChatInput({
    onSend,
    isSending = false,
    chatId,
    onFocus,
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
        <div className="sticky bottom-0 z-10 border-t bg-background px-4 py-3">
            {files.length > 0 && (
                <PhotoProvider>
                    <div className="mb-3 flex flex-wrap gap-2">
                        {files.map((file, index) => (
                            <FilePreviewItem
                                key={`${file.name}-${file.size}-${index}`}
                                file={file}
                                onRemove={() => removeFile(index)}
                                disabled={isSending}
                            />
                        ))}
                    </div>
                </PhotoProvider>
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
                    onFocus={onFocus}
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
