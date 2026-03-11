import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { groupsService } from "@/features/groups/groups-service"
import type { Chat } from "@/types/general"
import type { CreateGroupParams } from "@/types/groups"


export function useGroups() {
    return useQuery<Chat[], Error>({
        queryKey: ["groups"],
        queryFn: groupsService.getGroups,
    })
}

export function useGroup(id: number) {
    return useQuery<Chat, Error>({
        queryKey: ["group", id],
        queryFn: () => groupsService.getGroup(id),
    })
}

export function useCreateGroup() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (params: CreateGroupParams) => groupsService.createGroup(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
    })
}
