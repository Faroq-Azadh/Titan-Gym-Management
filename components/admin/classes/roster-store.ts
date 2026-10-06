import { ClassMember } from "./types";
import { isDeletedMember, normalizePersianName } from "@/lib/members-store";

const CLASS_ROSTER_PREFIX = "titan_gym_class_roster_";
export const ROSTER_UPDATED_EVENT = "titan_gym_roster_updated";

const BLACKLISTED_MEMBER_NAMES = new Set([
  "مریم رضایی",
  "محمد محمدی",
  "علی احمدی",
  "رضا قاسمی",
  "مریم حسینی",
  "سارا نیکنام",
  "حسین رضوانی",
  "مهرداد نادری",
  "زهرا موسوی",
]);

/**
 * Checks if a member in a class is disallowed (mock, deleted, Maryam Rezaei, or not in members list)
 */
export function isDisallowedMember(m: any, validMembers?: any[]): boolean {
  if (!m) return true;
  const idStr = String(m.id || "").trim();
  if (/^m[1-8]$/i.test(idStr)) return true;
  if (/^class_m[1-8]$/i.test(idStr)) return true;

  const name = String(m.name || m.fullName || "").trim();
  const normName = normalizePersianName(name);
  const maryamNorm = normalizePersianName("مریم رضایی");

  if (normName === maryamNorm || normName.includes(maryamNorm)) return true;
  if (BLACKLISTED_MEMBER_NAMES.has(name)) return true;
  if (isDeletedMember(idStr, name)) return true;

  // If a list of active gym members is provided, ensure this member actually exists in it
  if (validMembers && Array.isArray(validMembers) && validMembers.length > 0) {
    const rawPhone = String(m.phone || "").replace(/[^\d]/g, "");
    const foundInValidList = validMembers.some((vm: any) => {
      if (vm.isActive === false || vm.is_active === false) return false;
      if (String(vm.id) === idStr) return true;
      if (normalizePersianName(vm.fullName || vm.name) === normName) return true;
      if (rawPhone && rawPhone.length >= 7) {
        const vmPhone = String(vm.phone || vm.phone_number || "").replace(/[^\d]/g, "");
        if (vmPhone.endsWith(rawPhone) || rawPhone.endsWith(vmPhone)) return true;
      }
      return false;
    });

    if (!foundInValidList) {
      return true; // Not in the admin members list!
    }
  }

  return false;
}

// Backward-compatibility alias
export const isMockMember = (m: any) => isDisallowedMember(m);

/**
 * Purge disallowed / deleted members across all class rosters and local bookings
 */
export function purgeDisallowedMembersFromAllClassRosters(validMembers?: any[]): void {
  if (typeof window === "undefined") return;
  try {
    let changedAny = false;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CLASS_ROSTER_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter((m) => !isDisallowedMember(m, validMembers));
              if (cleaned.length !== parsed.length) {
                localStorage.setItem(key, JSON.stringify(cleaned));
                changedAny = true;
              }
            }
          } catch {}
        }
      }
    }

    // Also clean local bookings store if Maryam Rezaei or disallowed members exist
    try {
      const rawBookings = localStorage.getItem("titan_gym_bookings_local");
      if (rawBookings) {
        const parsedBookings = JSON.parse(rawBookings);
        if (Array.isArray(parsedBookings)) {
          const cleanedBookings = parsedBookings.filter((b) => {
            const bName = b.member_name || b.name || "";
            return !isDisallowedMember({ id: b.member_id || b.id, name: bName }, validMembers);
          });
          if (cleanedBookings.length !== parsedBookings.length) {
            localStorage.setItem("titan_gym_bookings_local", JSON.stringify(cleanedBookings));
            changedAny = true;
          }
        }
      }
    } catch {}

    if (changedAny) {
      window.dispatchEvent(new CustomEvent(ROSTER_UPDATED_EVENT));
    }
  } catch {}
}

// Backward-compatibility alias
export const purgeMockMembersFromStorage = () => purgeDisallowedMembersFromAllClassRosters();

// Auto-purge known disallowed members when running in browser
if (typeof window !== "undefined") {
  purgeDisallowedMembersFromAllClassRosters();
}

/**
 * Specifically remove a deleted member by ID or Name from all class rosters
 */
export function removeMemberFromAllClassRosters(id: string, name?: string): void {
  if (typeof window === "undefined") return;
  try {
    const normName = name ? normalizePersianName(name) : "";
    let changed = false;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CLASS_ROSTER_PREFIX)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter((m) => {
                if (id && String(m.id) === String(id)) return false;
                if (normName && normalizePersianName(m.name || m.fullName) === normName) return false;
                return true;
              });
              if (cleaned.length !== parsed.length) {
                localStorage.setItem(key, JSON.stringify(cleaned));
                changed = true;
              }
            }
          } catch {}
        }
      }
    }

    // Clean local bookings
    try {
      const rawBookings = localStorage.getItem("titan_gym_bookings_local");
      if (rawBookings) {
        const parsed = JSON.parse(rawBookings);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter((b) => {
            if (id && String(b.member_id || b.id) === String(id)) return false;
            if (normName && normalizePersianName(b.member_name) === normName) return false;
            return true;
          });
          if (cleaned.length !== parsed.length) {
            localStorage.setItem("titan_gym_bookings_local", JSON.stringify(cleaned));
            changed = true;
          }
        }
      }
    } catch {}

    if (changed) {
      window.dispatchEvent(new CustomEvent(ROSTER_UPDATED_EVENT));
    }
  } catch {}
}

/**
 * Retrieve class roster strictly filtered against active gym members
 */
export function getClassRoster(
  classId: string,
  defaultMembers: ClassMember[] = [],
  validMembers?: any[]
): ClassMember[] {
  if (typeof window === "undefined" || !classId) {
    return defaultMembers.filter((m) => !isDisallowedMember(m, validMembers));
  }
  try {
    const raw = localStorage.getItem(`${CLASS_ROSTER_PREFIX}${classId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const cleaned = parsed.filter((m) => !isDisallowedMember(m, validMembers));
        if (cleaned.length !== parsed.length) {
          localStorage.setItem(`${CLASS_ROSTER_PREFIX}${classId}`, JSON.stringify(cleaned));
        }
        return cleaned;
      }
    }
  } catch (err) {
    console.error("Failed to read class roster from localStorage:", err);
  }
  return defaultMembers.filter((m) => !isDisallowedMember(m, validMembers));
}

/**
 * Save class roster to localStorage, stripping any disallowed members
 */
export function saveClassRoster(
  classId: string,
  members: ClassMember[],
  validMembers?: any[]
): void {
  if (typeof window === "undefined" || !classId) return;
  try {
    const cleaned = members.filter((m) => !isDisallowedMember(m, validMembers));
    localStorage.setItem(`${CLASS_ROSTER_PREFIX}${classId}`, JSON.stringify(cleaned));
    window.dispatchEvent(new CustomEvent(ROSTER_UPDATED_EVENT, { detail: { classId, count: cleaned.length } }));
  } catch (err) {
    console.error("Failed to save class roster to localStorage:", err);
  }
}
