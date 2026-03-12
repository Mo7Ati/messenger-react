import { useNavigate, useParams } from "react-router"
import { useGroup } from "../hooks/use-groups-queries"
import ChatWindow from "@/features/messaging/components/chat/chat-window";

export default function GroupPreview() {
  const { groupId } = useParams<{ groupId: string }>()
  const { data: group, isPending } = useGroup(Number(groupId));
  const navigate = useNavigate();

  return (
    <ChatWindow
      participants={group?.participants ?? []}
      title={group?.label ?? "Group"}
      messages={group?.messages ?? []}
      isPending={isPending}
      onBack={() => navigate("/groups")}
    />
  )
}
