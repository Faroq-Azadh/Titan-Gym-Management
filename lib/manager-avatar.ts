/**
 * Persistent manager avatar storage & image compression helper
 * Ensures the gym manager's profile picture is never lost on logout or page refresh.
 */

export const MANAGER_AVATAR_KEY = "titan_manager_avatar";
export const USER_AVATAR_LEGACY_KEY = "titan_user_avatar";
export const AVATAR_UPDATED_EVENT = "titan:avatar-updated";

/**
 * Retrieve the saved avatar for the manager across persistent keys
 */
export function getSavedManagerAvatar(identifier?: string | null): string | null {
  if (typeof window === "undefined") return null;
  try {
    if (identifier) {
      const cleanId = String(identifier).trim().toLowerCase();
      const specific = localStorage.getItem(`titan_avatar_${cleanId}`);
      if (specific) return specific;
    }
    const managerAvatar = localStorage.getItem(MANAGER_AVATAR_KEY);
    if (managerAvatar) return managerAvatar;
    const userAvatar = localStorage.getItem(USER_AVATAR_LEGACY_KEY);
    if (userAvatar) return userAvatar;
  } catch {}
  return null;
}

/**
 * Persist the manager's avatar permanently in browser storage
 */
export function saveManagerAvatar(avatar: string, identifier?: string | null): void {
  if (typeof window === "undefined" || !avatar) return;
  try {
    localStorage.setItem(MANAGER_AVATAR_KEY, avatar);
    localStorage.setItem(USER_AVATAR_LEGACY_KEY, avatar);
    if (identifier) {
      const cleanId = String(identifier).trim().toLowerCase();
      localStorage.setItem(`titan_avatar_${cleanId}`, avatar);
    }
    window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: { avatar } }));
  } catch (err) {
    console.warn("Failed to persist manager avatar:", err);
  }
}

/**
 * Compress an image file to a lightweight data URL for responsive loading and storage
 */
export function compressAvatarImage(file: File, maxDim = 320, quality = 0.85): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}
