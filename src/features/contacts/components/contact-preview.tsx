import { useNavigate, useParams } from "react-router"
import { useContact } from "../hooks/use-contacts-queries";
import ChatWindow from "@/features/messaging/components/chat/chat-window";

export default function ContactPreview() {
  const { contactId } = useParams<{ contactId: string }>()
  const { data, isPending } = useContact(Number(contactId));
  const navigate = useNavigate();


  return (
    <ChatWindow
      participants={[data?.contact!]}
      title={data?.contact?.username ?? "Contact"}
      messages={data?.chat?.messages ?? []}
      isPending={isPending}
      onBack={() => navigate("/groups")}
    />
  )
}