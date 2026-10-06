"use client";

import { useState, useEffect } from "react";
import { tokenStorage } from "@/lib/api/token";

export const ATTENDANCE_STORAGE_KEY = "titan_gym_daily_attendance";
export const ATTENDANCE_UPDATED_EVENT = "titan_gym_attendance_updated";

interface DailyAttendanceRecord {
  date: string; // YYYY-MM-DD
  count: number;
  entries: string[]; // unique account or identifier tags
}

function getTodayIsoString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get stored daily attendance record for today
 */
export function getStoredTodayAttendance(): DailyAttendanceRecord {
  const today = getTodayIsoString();
  if (typeof window === "undefined") {
    return { date: today, count: 1, entries: ["admin_session"] };
  }

  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DailyAttendanceRecord;
      if (parsed && parsed.date === today) {
        // Ensure that if user is currently logged in, count is at least 1
        const hasToken = !!tokenStorage.getAccessToken();
        if (hasToken && (!parsed.count || parsed.count < 1)) {
          parsed.count = 1;
          if (!parsed.entries || parsed.entries.length === 0) {
            parsed.entries = ["current_account"];
          }
          localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading attendance storage:", err);
  }

  // Initial record for today: if user is authenticated/in panel, start with 1 entry
  const hasToken = typeof window !== "undefined" ? !!tokenStorage.getAccessToken() : true;
  const initialRecord: DailyAttendanceRecord = {
    date: today,
    count: hasToken ? 1 : 1, // Current active user account entered today
    entries: ["current_account"],
  };

  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(initialRecord));
    }
  } catch {}

  return initialRecord;
}

/**
 * Record a new account entry / check-in for today
 */
export function recordTodayEntry(identifier?: string): number {
  if (typeof window === "undefined") return 1;
  const today = getTodayIsoString();
  const current = getStoredTodayAttendance();

  const idTag = identifier || `account_${Date.now()}`;
  const existingEntries = Array.isArray(current.entries) ? current.entries : [];

  let newEntries = existingEntries;
  if (!existingEntries.includes(idTag)) {
    newEntries = [...existingEntries, idTag];
  }

  const newCount = Math.max(current.count, newEntries.length, 1);

  const updated: DailyAttendanceRecord = {
    date: today,
    count: newCount,
    entries: newEntries,
  };

  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(ATTENDANCE_UPDATED_EVENT, { detail: updated }),
    );
  } catch (err) {
    console.error("Error saving attendance:", err);
  }

  return newCount;
}

/**
 * Hook to get today's attendance count, synchronizing backend data with local account entries
 */
export function useTodayAttendance(backendTodayCheckins?: number | null) {
  const [localCount, setLocalCount] = useState<number>(() => {
    return getStoredTodayAttendance().count;
  });

  useEffect(() => {
    setLocalCount(getStoredTodayAttendance().count);

    const handleUpdate = () => {
      setLocalCount(getStoredTodayAttendance().count);
    };

    window.addEventListener(ATTENDANCE_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(ATTENDANCE_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const backendVal = typeof backendTodayCheckins === "number" ? backendTodayCheckins : 0;
  // If user entered today, the count must be at least 1 (or backendVal if backend reported higher)
  const effectiveTodayCheckins = Math.max(backendVal, localCount, 1);

  return {
    todayCheckins: effectiveTodayCheckins,
    recordEntry: recordTodayEntry,
  };
}
