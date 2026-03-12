import ChatWindow from "@/features/messaging/components/chat/chat-window";
import useGroupScreen from "../hooks/use-group-screen";

export default function GroupPreview() {

  const screen = useGroupScreen();

  return (
    <ChatWindow
      participants={screen.participants}
      title={screen.title}
      messages={screen.messages}
      isFetching={screen.isFetching }
      isSending={screen.isSending}
      onBack={screen.onBack}
      onSend={screen.handleSend}
      asGroup
    />
  )
}
