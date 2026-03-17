import { useAuth } from "@/features/auth/auth-context"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"

export default function SocialCallback() {
  const { checkAuth } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (error) {
      toast.error(error)
      navigate("/login", { replace: true })
      return
    }

    checkAuth()
      .then(() => {
        toast.success("Logged in successfully")
        navigate("/chats", { replace: true })
      })
      .catch(() => {
        toast.error("Social login failed")
        navigate("/login", { replace: true })
      })
  }, [checkAuth, navigate, searchParams])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
