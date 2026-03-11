import { useNavigate, useParams } from "react-router"

export default function ContactPreview() {
  const { contactId } = useParams<{ contactId: string }>()

  return (
    <div>
      <h1>Contact Preview</h1>
    </div>
  )
}