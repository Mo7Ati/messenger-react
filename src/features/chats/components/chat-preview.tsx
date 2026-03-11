import { useParams } from "react-router"
import { ConversationPreview } from "@/components/shared/conversation-preview"

export default function ChatPreview() {
  const { chatId } = useParams<{ chatId: string }>()
  return (
    <ConversationPreview
      conversationId={Number(chatId)}
      backPath="/chats"
    />
  )
  
}