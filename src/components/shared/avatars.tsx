import type { User } from '@/types/general'
import React from 'react'
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '../ui/avatar'

const Avatars = ({ participants }: { participants: User[] }) => {
    const visibleParticipants = React.useMemo(() => participants.slice(0, 2), [participants])
    const extraParticipantsCount = Math.max(participants.length - 2, 0)

    return (
        <div className="shrink-0">
            <AvatarGroup>
                {visibleParticipants.map((participant) => (
                    <Avatar key={participant.id}>
                        <AvatarImage src={participant.avatar_url} alt={participant.username} />
                        <AvatarFallback>
                            {participant.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                    </Avatar>
                ))}

                {extraParticipantsCount > 0 && (
                    <AvatarGroupCount>+{extraParticipantsCount}</AvatarGroupCount>
                )}
            </AvatarGroup>
        </div>

    )
}

export default Avatars