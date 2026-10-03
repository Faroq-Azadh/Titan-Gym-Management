import { ClassMember } from "./types";

const CLASS_ROSTER_PREFIX = "titan_gym_class_roster_";

export function getClassRoster(classId: string, defaultMembers: ClassMember[] = []): ClassMember[] {
  if (typeof window === "undefined" || !classId) return defaultMembers;
  try {
    const raw = localStorage.getItem(`${CLASS_ROSTER_PREFIX}${classId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Failed to read class roster from localStorage:", err);
  }
  return defaultMembers;
}

export function saveClassRoster(classId: string, members: ClassMember[]): void {
  if (typeof window === "undefined" || !classId) return;
  try {
    localStorage.setItem(`${CLASS_ROSTER_PREFIX}${classId}`, JSON.stringify(members));
  } catch (err) {
    console.error("Failed to save class roster to localStorage:", err);
  }
}
