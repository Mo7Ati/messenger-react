import { useParams } from "react-router"
import { ConversationPreview } from "@/components/shared/conversation-preview"

export default function GroupPreview() {
  const { groupId } = useParams<{ groupId: string }>()
  return (
    <ConversationPreview
      conversationId={Number(groupId)}
      backPath="/groups"
    />
  )
}
