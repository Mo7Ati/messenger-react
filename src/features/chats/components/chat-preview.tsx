import { useParams } from "react-router"

export default function ChatPreview() {
  const { chatId } = useParams<{ chatId: string }>()
  return (
    <div>
      <h1>Chat Preview</h1>
    </div>
  )

}