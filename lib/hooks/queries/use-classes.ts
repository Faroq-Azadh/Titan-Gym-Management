"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  classesService,
  markClassAsDeleted,
  type GymClassTemplate,
  type ClassCalendarResponse,
  type BookingRosterResponse,
  type BookingRosterRow,
  type CreateClassPayload,
  type CreateBookingPayload,
} from "@/lib/api/services/classes.service";
import { tokenStorage } from "@/lib/api/token";

export function useClasses() {
  return useQuery<GymClassTemplate[], Error>({
    queryKey: ["classes"],
    queryFn: () => classesService.getClasses(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 5 * 1000,
  });
}

export function useClassCalendar() {
  return useQuery<ClassCalendarResponse, Error>({
    queryKey: ["classes-calendar"],
    queryFn: () => classesService.getCalendar(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 5 * 1000,
  });
}

export function useBookings(params?: { date?: string; q?: string; status?: string }) {
  return useQuery<BookingRosterResponse, Error>({
    queryKey: ["classes-bookings", params],
    queryFn: () => classesService.getBookings(params),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 5 * 1000,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassPayload) => classesService.createClass(payload),
    onSuccess: async (newClass) => {
      if (newClass && newClass.id) {
        queryClient.setQueryData<GymClassTemplate[]>(["classes"], (old) => {
          if (!old || !Array.isArray(old)) return [newClass];
          return [newClass, ...old];
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["classes"] });
      await queryClient.refetchQueries({ queryKey: ["classes"] });
      await queryClient.invalidateQueries({ queryKey: ["classes-calendar"] });
      await queryClient.refetchQueries({ queryKey: ["classes-calendar"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<CreateClassPayload> }) =>
      classesService.updateClass(id, payload),
    onSuccess: async (updatedClass, variables) => {
      // 1. Immediately update query cache with new values so UI updates instantly
      queryClient.setQueryData<GymClassTemplate[]>(["classes"], (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((item) => {
          if (String(item.id) === String(variables.id)) {
            return {
              ...item,
              ...variables.payload,
              ...updatedClass,
              id: String(variables.id),
            };
          }
          return item;
        });
      });

      // 2. Refetch queries from backend
      await queryClient.invalidateQueries({ queryKey: ["classes"] });
      await queryClient.refetchQueries({ queryKey: ["classes"] });
      await queryClient.invalidateQueries({ queryKey: ["classes-calendar"] });
      await queryClient.refetchQueries({ queryKey: ["classes-calendar"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => classesService.deleteClass(id),
    onSuccess: async (_, id) => {
      markClassAsDeleted(id);
      queryClient.setQueryData<GymClassTemplate[]>(["classes"], (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.filter((item) => String(item.id) !== String(id) && item.is_active !== false);
      });
      await queryClient.invalidateQueries({ queryKey: ["classes"] });
      await queryClient.refetchQueries({ queryKey: ["classes"] });
      await queryClient.invalidateQueries({ queryKey: ["classes-calendar"] });
      await queryClient.refetchQueries({ queryKey: ["classes-calendar"] });
      await queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useApproveBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => classesService.approveBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useRejectBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => classesService.rejectBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => classesService.createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      classesService.deleteBooking(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
}
