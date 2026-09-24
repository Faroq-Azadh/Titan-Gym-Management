const PERSIAN_DIGIT_MAP: Record<string, string> = {
  "0": "۰",
  "1": "۱",
  "2": "۲",
  "3": "۳",
  "4": "۴",
  "5": "۵",
  "6": "۶",
  "7": "۷",
  "8": "۸",
  "9": "۹",
};

const PERSIAN_ARABIC_TO_ENGLISH_MAP: Record<string, string> = {
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
};

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGIT_MAP[digit] || digit);
}

/**
 * Converts Persian and Arabic digits to English digits (0-9)
 * Preserves letters, special characters, email symbols (@, ., etc.)
 */
export function normalizeDigits(value: string): string {
  if (!value) return "";
  return value.replace(/[۰-۹٠-٩]/g, (char) => PERSIAN_ARABIC_TO_ENGLISH_MAP[char] || char);
}

/**
 * Extracts ONLY digits from a string and converts them to English (0-9).
 * Removes all non-digit characters.
 */
export function extractDigitsOnly(value: string): string {
  if (!value) return "";
  return normalizeDigits(value).replace(/\D/g, "");
}
