import { useNavigate, useParams } from "react-router"
import ChatWindow from "@/components/chat-window"
import { useConversationScreen } from "@/hooks/use-conversation-screen"

export default function ContactPreview() {
  const { contactId } = useParams<{ contactId: string }>()
  const navigate = useNavigate()

  const screen = useConversationScreen({
    mode: "contact",
    contactId: Number(contactId),
  })
  console.log(screen);
  

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      messages={screen.messages}
      input={screen.input}
      isLoading={screen.isLoading}
      isSending={screen.isSending}
      onBack={() => navigate("/contacts")}
      onInputChange={screen.onInputChange}
      onSend={screen.onSend}
    />
  )
}