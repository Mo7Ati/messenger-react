import { useUser } from '@/features/auth/auth-context';
import { useEcho, useEchoPresence } from '@laravel/echo-react';
import useUpdateCache from './use-update-cache';
import type { Chat, Message } from '@/types/general';
import type { ContactRequestSentPayload, ContactRequestUpdatedPayload } from '@/types/contacts';
import { toast } from 'sonner';
import { playNotificationSound } from '@/lib/utils';

const useChannels = () => {
    const user = useUser();
    const {
        syncMessage,
        syncTyping,
        syncStopTyping,
        appendGroupToGroupsList,
        addReceivedContactRequest,
        updateSentContactRequestStatus,
    } = useUpdateCache();

    // Listen for new messages in the inbox channel
    useEcho(`messenger.user.${user.id}`, "MessageCreated", (payload: { message: Message }) => {
        syncMessage(payload.message);
        toast.success(`${payload.message.user.username} : ${payload.message.body}`);
        playNotificationSound();
    });
    // Listen for new groups in the messenger channel
    useEcho(`messenger.user.${user.id}`, "GroupCreated", (payload: { group: Chat }) => {
        appendGroupToGroupsList(payload.group);
        toast.success(`You are added to ${payload.group.label} group`);
        playNotificationSound();
    });
    // Listen for new contact requests in the messenger channel
    useEcho(
        `messenger.user.${user.id}`,
        "ContactRequestSent",
        (payload: ContactRequestSentPayload) => {
            const request = payload.contact_request;
            addReceivedContactRequest(request);
            playNotificationSound();
            toast(`${request.sender.username} sent you a contact request`);
        }
    );
    // Listen for updated contact requests in the messenger channel
    useEcho(
        `messenger.user.${user.id}`,
        "ContactRequestUpdated",
        (payload: ContactRequestUpdatedPayload) => {
            const request = payload.contact_request;
            updateSentContactRequestStatus(request);

            if (request.status === "accepted") {
                playNotificationSound();
                toast.success(`${request.receiver.username} accepted your contact request`);
            }
        }
    );

    // Listen for typing and stop-typing in the messenger channel
    const messengerChannel = useEchoPresence(`messenger`).channel;
    messengerChannel().listenForWhisper("typing", syncTyping);
    messengerChannel().listenForWhisper("stop-typing", syncStopTyping);
    return {
        messengerChannel,
    }
}

export default useChannels