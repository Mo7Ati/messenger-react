import type { User } from "@/types/general"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const PARTICIPANT_NAME_COLORS = [
  "text-red-700 dark:text-red-400",
  "text-blue-700 dark:text-blue-400",
  "text-emerald-700 dark:text-emerald-400",
  "text-violet-700 dark:text-violet-400",
  "text-amber-700 dark:text-amber-400",
  "text-cyan-700 dark:text-cyan-400",
  "text-rose-700 dark:text-rose-400",
  "text-indigo-700 dark:text-indigo-400",
  "text-teal-700 dark:text-teal-400",
  "text-orange-700 dark:text-orange-400",
] as const

export function getParticipantNameColor(userId: number): string {
  const index = Math.abs(userId) % PARTICIPANT_NAME_COLORS.length
  return PARTICIPANT_NAME_COLORS[index]
}



export function formatTypingHeader(typingUsers: User[]): string {
  if (typingUsers.length === 0) return ""
  if (typingUsers.length === 1) return `${typingUsers[0].name} is typing...`
  if (typingUsers.length === 2) return `${typingUsers[0].name} and ${typingUsers[1].name} are typing...`
  return `${typingUsers[0].name} and ${typingUsers.length - 1} others are typing...`
}