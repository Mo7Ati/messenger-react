import { useParams } from "react-router"

export default function GroupPreview() {
  const { groupId } = useParams<{ groupId: string }>()
  return (
    <div>
      <h1>Group Preview</h1>
    </div>
  )
}
