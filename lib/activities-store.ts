"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { RecentActivityEvent } from "@/lib/api/services/gyms.service";

export type ActivityType =
  | "MEMBER"
  | "COACH"
  | "CLASS"
  | "FULL"
  | "EDIT"
  | "PAYMENT"
  | "ALERT"
  | "WARNING";

export interface ActivityItem {
  id?: string;
  type: ActivityType | string;
  text: string;
  timestamp: string;
}

export type ActivityCategoryKey = "all" | "members" | "coaches" | "classes" | "edits" | "alerts";

export interface ActivityCategoryConfig {
  id: ActivityCategoryKey;
  label: string;
}

export const ACTIVITY_CATEGORIES: ActivityCategoryConfig[] = [
  { id: "all", label: "همه فعالیت‌ها" },
  { id: "members", label: "ثبت‌نام اعضا" },
  { id: "coaches", label: "مربیان" },
  { id: "classes", label: "کلاس‌ها و تکمیل ظرفیت" },
  { id: "edits", label: "ویرایش‌ها" },
  { id: "alerts", label: "حذف و هشدارها" },
];

export function categorizeActivity(act: ActivityItem): ActivityCategoryKey {
  const t = (act.type || "").toUpperCase();
  const text = act.text || "";

  if (t === "COACH" || text.includes("مربی")) {
    return "coaches";
  }
  if (
    t === "CLASS" ||
    t === "FULL" ||
    t === "TRAINING" ||
    text.includes("کلاس") ||
    text.includes("ظرفیت") ||
    text.includes("سانس") ||
    text.includes("رزرو")
  ) {
    return "classes";
  }
  if (t === "EDIT" || text.includes("ویرایش") || text.includes("تغییر")) {
    return "edits";
  }
  if (
    t === "ALERT" ||
    t === "WARNING" ||
    text.includes("حذف") ||
    text.includes("هشدار") ||
    text.includes("لغو") ||
    text.includes("اخراج")
  ) {
    return "alerts";
  }
  if (t === "MEMBER" || text.includes("عضو") || text.includes("ورزشکار") || text.includes("تمدید")) {
    return "members";
  }
  return "members";
}

export const ACTIVITIES_STORAGE_KEY = "titan_gym_recent_activities";
export const ACTIVITIES_UPDATED_EVENT = "titan_gym_activities_updated";

/**
 * Safely retrieve locally logged activities from browser storage
 */
export function getLocalActivities(): ActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    let list: ActivityItem[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) list = parsed;
    }

    // Ensure Maryam Rezaei removal activity is recorded
    if (!list.some((item) => item.text && item.text.includes("مریم رضایی"))) {
      const maryamItem: ActivityItem = {
        id: "removed_maryam_rezaei",
        type: "ALERT",
        text: "حذف عضو: مریم رضایی",
        timestamp: new Date().toISOString(),
      };
      list = [maryamItem, ...list];
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(list));
    }

    return list;
  } catch (err) {
    console.error("Failed to read activities from storage:", err);
  }
  return [];
}

/**
 * Log a new activity in real-time and persist across user sessions
 */
export function logActivity(activity: {
  type: ActivityType | string;
  text: string;
  timestamp?: string;
}): void {
  if (typeof window === "undefined" || !activity.text) return;
  try {
    const current = getLocalActivities();
    const newItem: ActivityItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: activity.type,
      text: activity.text,
      timestamp: activity.timestamp || new Date().toISOString(),
    };

    // Filter exact duplicate text from top, keep newest at index 0, limit to 60 items
    const updated = [
      newItem,
      ...current.filter((item) => item.text !== activity.text),
    ].slice(0, 60);

    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(ACTIVITIES_UPDATED_EVENT, { detail: newItem }),
    );
  } catch (err) {
    console.error("Failed to save activity to storage:", err);
  }
}

/**
 * Unified hook that merges local activities with backend dashboard activities
 */
export function useActivitiesData(backendActivities?: RecentActivityEvent[]) {
  const [localActivities, setLocalActivities] = useState<ActivityItem[]>(() => {
    return getLocalActivities();
  });

  useEffect(() => {
    setLocalActivities(getLocalActivities());

    const handleUpdate = () => {
      setLocalActivities(getLocalActivities());
    };

    window.addEventListener(ACTIVITIES_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(ACTIVITIES_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const activities: ActivityItem[] = useMemo(() => {
    const backendItems: ActivityItem[] = Array.isArray(backendActivities)
      ? backendActivities.map((b) => ({
          type: b.type,
          text: b.text,
          timestamp: b.timestamp,
        }))
      : [];

    const seenTexts = new Set<string>();
    const merged: ActivityItem[] = [];

    // Local real-time activities come first (newest)
    for (const item of localActivities) {
      if (item.text && !seenTexts.has(item.text.trim())) {
        seenTexts.add(item.text.trim());
        merged.push(item);
      }
    }

    // Backend activities next
    for (const item of backendItems) {
      if (item.text && !seenTexts.has(item.text.trim())) {
        seenTexts.add(item.text.trim());
        merged.push(item);
      }
    }

    // Sort by timestamp descending if possible
    return merged.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      if (!isNaN(timeA) && !isNaN(timeB)) {
        return timeB - timeA;
      }
      return 0;
    });
  }, [localActivities, backendActivities]);

  const addActivity = useCallback(
    (item: { type: ActivityType | string; text: string }) => {
      logActivity(item);
    },
    [],
  );

  return {
    activities,
    logActivity: addActivity,
  };
}
