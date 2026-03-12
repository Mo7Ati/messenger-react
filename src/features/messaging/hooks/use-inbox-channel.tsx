import { useUser } from "@/features/auth/auth-context"
import type { Message } from "@/types/general";
import { useEcho } from "@laravel/echo-react"
import useUpdateCache from "@/hooks/use-update-cache";

const useInboxChannel = () => {
    const user = useUser();
    const { syncMessage } = useUpdateCache()

    const syncIncomingMessage = ({ message }: { message: Message }) => {
        syncMessage(message)
    }

    useEcho<{ message: Message }>(`messenger.user.${user.id}`, "MessageCreated", syncIncomingMessage);
}

export default useInboxChannel