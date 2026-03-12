import { useUser } from "@/features/auth/auth-context"
import type { Chat, Message } from "@/types/general";
import type { GetContactResponse } from "@/types/contacts";
import { useEcho } from "@laravel/echo-react"
import { useQueryClient } from "@tanstack/react-query";

const useInboxChannel = () => {
    const user = useUser();
    const queryClient = useQueryClient();

    const syncIncomingMessage = (message: Message) => {

    }

    useEcho<Message>(`messenger.user.${user.id}`, "MessageCreated", syncIncomingMessage);
}

export default useInboxChannel