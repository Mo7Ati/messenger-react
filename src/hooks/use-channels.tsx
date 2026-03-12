import { useUser } from '@/features/auth/auth-context';
import { useEcho, useEchoPresence } from '@laravel/echo-react';
import useUpdateCache from './use-update-cache';
import type { Message } from '@/types/general';

const useChannels = () => {
    const user = useUser();
    const { syncMessage, syncTyping, syncStopTyping } = useUpdateCache();

    // Listen for new messages in the inbox channel
    useEcho(`messenger.user.${user.id}`, "MessageCreated", (payload: { message: Message }) => {
        syncMessage(payload.message);
    });

    // Listen for typing and stop-typing in the messenger channel
    const messengerChannel = useEchoPresence(`messenger`).channel;
    messengerChannel().listenForWhisper("typing", syncTyping);
    messengerChannel().listenForWhisper("stop-typing", syncStopTyping);

    return {
        messengerChannel,
    }
}

export default useChannels