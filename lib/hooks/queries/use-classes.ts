"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  classesService,
  type GymClassTemplate,
  type ClassCalendarResponse,
  type BookingItem,
  type CreateClassPayload,
  type CreateBookingPayload,
} from "@/lib/api/services/classes.service";
import { tokenStorage } from "@/lib/api/token";

export function useClasses() {
  return useQuery<GymClassTemplate[], Error>({
    queryKey: ["classes"],
    queryFn: () => classesService.getClasses(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 60 * 1000,
  });
}

export function useClassCalendar() {
  return useQuery<ClassCalendarResponse, Error>({
    queryKey: ["classes-calendar"],
    queryFn: () => classesService.getCalendar(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 60 * 1000,
  });
}

export function useBookings() {
  return useQuery<BookingItem[], Error>({
    queryKey: ["classes-bookings"],
    queryFn: () => classesService.getBookings(),
    enabled: typeof window !== "undefined" && tokenStorage.hasValidSession(),
    staleTime: 30 * 1000,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateClassPayload) => classesService.createClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<CreateClassPayload> }) =>
      classesService.updateClass(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => classesService.deleteClass(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      queryClient.invalidateQueries({ queryKey: ["classes-calendar"] });
      queryClient.invalidateQueries({ queryKey: ["owner-dashboard"] });
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
    },
  });
}
