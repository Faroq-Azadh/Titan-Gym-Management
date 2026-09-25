"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  membersService,
  type PaginatedMembersResponse,
  type MemberListItem,
  type CreateMemberPayload,
} from "@/lib/api/services/members.service";
import { tokenStorage } from "@/lib/api/token";

export function useMembers(params?: {
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}) {
  return useQuery<PaginatedMembersResponse, Error>({
    queryKey: ["members", params],
    queryFn: () => membersService.getMembers(params),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 30 * 1000,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMemberPayload) => membersService.createMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<CreateMemberPayload> }) =>
      membersService.updateMember(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => membersService.deleteMember(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueriesData({ queryKey: ["members"] }, (oldData: any) => {
        if (!oldData) return oldData;
        if (Array.isArray(oldData)) {
          return oldData.filter((m: any) => String(m.id) !== String(deletedId));
        }
        if (Array.isArray(oldData?.results)) {
          return {
            ...oldData,
            count: Math.max(0, (oldData.count || 1) - 1),
            results: oldData.results.filter((m: any) => String(m.id) !== String(deletedId)),
          };
        }
        return oldData;
      });
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}
