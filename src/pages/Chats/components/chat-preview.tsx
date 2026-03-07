import { useNavigate, useParams } from "react-router"
import ChatWindow from "@/components/chat-window"
import { useConversationScreen } from "@/hooks/use-conversation-screen"

export default function ChatPreview() {
    const { chatId } = useParams<{ chatId: string }>()
    const navigate = useNavigate()

    const screen = useConversationScreen({
        mode: "chat",
        chatId: Number(chatId),
    })

    return (
        <ChatWindow
            participants={screen.participants}
            title={screen.title}
            messages={screen.messages}
            input={screen.input}
            isLoading={screen.isLoading}
            isSending={screen.isSending}
            onBack={() => navigate("/chats")}
            onInputChange={screen.onInputChange}
            onSend={screen.onSend}
        />
    )
}