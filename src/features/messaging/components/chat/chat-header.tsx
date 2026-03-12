import Avatars from '@/components/shared/avatars';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/general';
import { ArrowLeft, MoreVertical } from 'lucide-react';


type ChatHeaderType = {
    title: string,
    participants: User[];
    onBack: () => void
}


const ChatHeader = ({ title, participants, onBack }: ChatHeaderType) => {
    return (
        <div className="flex items-center gap-3 px-4 py-3">
            {/* Back Button For Mobile */}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                onClick={onBack}
            >
                <ArrowLeft size={18} />
            </Button>
            
            {/* Participants Avatars */}
            <Avatars participants={participants} />

            {/* Title */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{title}</p>
            </div>

            {/* More Options */}
            <div className="shrink-0 flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                    <MoreVertical size={18} />
                </Button>
            </div>
        </div>
    )
}

export default ChatHeader