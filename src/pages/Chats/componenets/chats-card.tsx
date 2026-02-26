// import { cn } from "@/lib/utils"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { CheckCheckIcon, PlusIcon, SearchIcon } from "lucide-react"

// type Chat = {
//   id: number
//   name: string
//   preview: string
//   time: string
//   unread?: number
//   initials: string
//   status?: "online" | "offline"
//   color?: string
// }

// const chats: Chat[] = [
//   {
//     id: 1,
//     name: "Jacquenetta Slowgrave",
//     preview: "Great! Looking forward to it. Se...",
//     time: "10 minutes",
//     unread: 8,
//     initials: "JS",
//     status: "online",
//     color: "bg-pink-500",
//   },
//   {
//     id: 2,
//     name: "Nickola Peever",
//     preview: "Sounds perfect! I've been wantin...",
//     time: "40 minutes",
//     unread: 2,
//     initials: "NP",
//     status: "online",
//     color: "bg-emerald-500",
//   },
//   {
//     id: 3,
//     name: "Farand Hume",
//     preview: "How about 7 PM at the new Itali...",
//     time: "Yesterday",
//     initials: "FH",
//     status: "online",
//     color: "bg-slate-500",
//   },
//   {
//     id: 4,
//     name: "Ossie Peasey",
//     preview: "Hey Bonnie, yes, definitely! Wha...",
//     time: "13 days",
//     initials: "OP",
//     status: "online",
//     color: "bg-indigo-500",
//   },
//   {
//     id: 5,
//     name: "Hall Negri",
//     preview: "No worries at all! I'll grab a...",
//     time: "2 days",
//     initials: "HN",
//     status: "offline",
//     color: "bg-amber-500",
//   },
//   {
//     id: 6,
//     name: "Elyssa Segot",
//     preview: "She just told me today.",
//     time: "Yesterday",
//     initials: "ES",
//     status: "online",
//     color: "bg-rose-500",
//   },
//   {
//     id: 7,
//     name: "Gil Wilfing",
//     preview: "Thanks for sending that over.",
//     time: "1 day",
//     initials: "GW",
//     status: "offline",
//     color: "bg-cyan-500",
//   },
//   {
//     id: 3,
//     name: "Farand Hume",
//     preview: "How about 7 PM at the new Itali...",
//     time: "Yesterday",
//     initials: "FH",
//     status: "online",
//     color: "bg-slate-500",
//   },
//   {
//     id: 3,
//     name: "Farand Hume",
//     preview: "How about 7 PM at the new Itali...",
//     time: "Yesterday",
//     initials: "FH",
//     status: "online",
//     color: "bg-slate-500",
//   },
//   {
//     id: 3,
//     name: "Farand Hume",
//     preview: "How about 7 PM at the new Itali...",
//     time: "Yesterday",
//     initials: "FH",
//     status: "online",
//     color: "bg-slate-500",
//   }, {
//     id: 3,
//     name: "Farand Hume",
//     preview: "How about 7 PM at the new Itali...",
//     time: "Yesterday",
//     initials: "FH",
//     status: "online",
//     color: "bg-slate-500",
//   },
// ]


// interface ChatsCardProps {
//   selectedChatId: number | null
//   setSelectedChatId: (id: number | null) => void
// }

// export default function ChatsCard({
//   selectedChatId,
//   setSelectedChatId,
// }: ChatsCardProps) {
//   return (
//     <Card className="flex h-full flex-col">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle className="text-lg">Chats</CardTitle>
//             <CardDescription className="mt-0.5 text-xs">
//               Stay on top of your conversations
//             </CardDescription>
//           </div>
//           <Button
//             size="icon"
//             variant="outline"
//             className="h-8 w-8 rounded-full"
//           >
//             <PlusIcon className="h-4 w-4" />
//             <span className="sr-only">Start a new chat</span>
//           </Button>
//         </div>
//         <div className="mt-3">
//           <div className="relative">
//             <Input
//               placeholder="Search chats"
//               className="w-full"
//             />
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="flex-1 pt-0 overflow-hidden">
//         <div className="h-full space-y-1 overflow-y-auto pr-1">
//           <ul>
//             {chats.map((chat) => {
//               const isSelected = chat.id === selectedChatId
//               const hasUnread = typeof chat.unread === "number" && chat.unread > 0

//               return (
//                 <button
//                   key={chat.id}
//                   type="button"
//                   onClick={() => setSelectedChatId(chat.id)}
//                   className={cn(
//                     "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors",
//                     isSelected
//                       ? "bg-muted"
//                       : "hover:bg-muted/80 focus-visible:bg-muted/80"
//                   )}
//                 >
//                   <div className="relative">
//                     <div
//                       className={cn(
//                         "flex h-10 w-10 items-center justify-center rounded-full text-[10px] font-semibold text-white",
//                         chat.color ?? "bg-slate-500"
//                       )}
//                     >
//                       {chat.initials}
//                     </div>
//                     {chat.status === "online" && (
//                       <span className="bg-emerald-500 border-background absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border" />
//                     )}
//                   </div>

//                   <div className="min-w-0 flex-1 space-y-0.5">
//                     <div className="flex items-center gap-2">
//                       <p className="truncate text-xs font-medium sm:text-sm">
//                         {chat.name}
//                       </p>
//                     </div>
//                     <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
//                       {!hasUnread && (
//                         <CheckCheckIcon className="text-emerald-500 h-3.5 w-3.5 shrink-0" />
//                       )}
//                       <span className="truncate">
//                         {chat.preview}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex flex-col items-end gap-1">
//                     <span className="text-[10px] text-muted-foreground">
//                       {chat.time}
//                     </span>
//                     {hasUnread && (
//                       <Badge
//                         variant="secondary"
//                         className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30 h-5 min-w-5 justify-center rounded-full px-2 text-[10px] font-semibold"
//                       >
//                         {chat.unread}
//                       </Badge>
//                     )}
//                   </div>
//                 </button>
//               )
//             })}
//           </ul>

//           {chats.length === 0 && (
//             <div className="text-muted-foreground flex items-center justify-center py-6 text-xs">
//               No chats match your search.
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, CheckCheck, Plus, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { use } from "react"

type Chat = {
  id: number
  name: string
  message: string
  time: string
  unread?: number
  online?: boolean
  doubleCheck?: boolean
}

interface Props {
  selectedChatId: number | null
  setSelectedChatId: (id: number) => void
}

const chats: Chat[] = [
  {
    id: 1,
    name: "Ossie Peasey",
    message: "Hey Bonnie, yes, definitely! What time...",
    time: "13 days",
    online: true,
    doubleCheck: true,
  },
  {
    id: 2,
    name: "Hall Negri",
    message: "No worries at all! I’ll grab a table...",
    time: "2 days",
    online: true,
  },
  {
    id: 3,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 4,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 5,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 6,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 7,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 8,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 9,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 10,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
  {
    id: 11,
    name: "Janith Satch",
    message: "Absolutely! It’s amazing to see...",
    time: "1 day",
    unread: 2,
    online: true,
    doubleCheck: true,
  },
]

export default function ChatsCard({
  selectedChatId,
  setSelectedChatId,
}: Props) {
  // const chats = use(getChats())


  return (
    <Card className="flex flex-col rounded-2xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between py-4 px-4">
        <CardTitle className="text-xl font-semibold">
          Chats
        </CardTitle>

        <Button
          size="icon"
          variant="secondary"
          className="h-8 w-8 rounded-full"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 px-3 pb-3 overflow-hidden">
        {/* Search */}
        <div className="relative m-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chats search..."
            className="pl-9 h-9 rounded-full text-sm"
          />
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="space-y-5">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors",
                  selectedChatId === chat.id
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {chat.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {chat.online && (
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium truncate">
                      {chat.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {chat.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
                    {chat.doubleCheck ? (
                      <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    <span className="truncate">
                      {chat.message}
                    </span>
                  </div>
                </div>

                {/* Unread badge */}
                {chat.unread && (
                  <div className="h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-medium">
                    {chat.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}


async function getChats(): Promise<Chat[]> {
  return fetch('http://localhost:8000/api/conversations')
    .then(response => response.json())
    .then(data => data)
}