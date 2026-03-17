import type { Chat, Message } from '@/types/general'
import { FileText } from 'lucide-react'

const useFormatLastMessage = () => {

    const isLastMessageAttachment = (message: Message) => {
        return message.type === "attachment"
    }

    const minifyLastMessageBody = (message: Message): string => {
        return message.body.length > 20 ? message.body.slice(0, 20) + "..." : message.body
    }


    const formatLastMessageLabel = (chat: Chat) => {

        if (isLastMessageAttachment(chat.last_message)) {
            return (
                <div className="flex items-center gap-1">
                    <FileText size={14} className="shrink-0" />
                    <span className="truncate max-w-[180px]">
                        Attachment
                    </span>
                </div>
            )
        }
        const body = minifyLastMessageBody(chat.last_message);

        if (!chat.last_message.is_mine) {
            return chat.type === "group" ? chat.last_message.user.username + ": " + body : body
        }

        return "You: " + body
    }

    return {
        formatLastMessageLabel,
    }
}

export default useFormatLastMessage