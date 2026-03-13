import { useUser } from '@/features/auth/auth-context';
import { useEcho, useEchoPresence } from '@laravel/echo-react';
import useUpdateCache from './use-update-cache';
import type { Chat, Message } from '@/types/general';

const useChannels = () => {
    const user = useUser();
    const { syncMessage, syncTyping, syncStopTyping, appendGroupToGroupsList } = useUpdateCache();

    // Listen for new messages in the inbox channel
    useEcho(`messenger.user.${user.id}`, "MessageCreated", (payload: { message: Message }) => {
        syncMessage(payload.message);
    });
    useEcho(`messenger.user.${user.id}`, "GroupCreated", (payload: { group: Chat }) => {
        appendGroupToGroupsList(payload.group);
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