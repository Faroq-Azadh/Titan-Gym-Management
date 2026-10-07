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

/**
 * Converts a monetary number (in Tomans) to Persian words.
 * E.g., 1200000 -> "یک میلیون و دویست هزار تومان"
 */
export function formatPriceToWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "";
  const yekan = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
  const dahgan1 = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
  const dahgan = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
  const sadgan = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
  const scales = ["", "هزار", "میلیون", "میلیارد"];

  function threeDigitsToWords(n: number): string {
    const s: string[] = [];
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const y = n % 10;
    if (c > 0) s.push(sadgan[c]);
    if (d === 1) {
      s.push(dahgan1[y]);
    } else {
      if (d > 1) s.push(dahgan[d]);
      if (y > 0) s.push(yekan[y]);
    }
    return s.join(" و ");
  }

  const parts: string[] = [];
  let scaleIdx = 0;
  let remaining = Math.floor(num);
  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const chunkWords = threeDigitsToWords(chunk);
      const scaleName = scales[scaleIdx];
      parts.unshift(scaleName ? `${chunkWords} ${scaleName}` : chunkWords);
    }
    remaining = Math.floor(remaining / 1000);
    scaleIdx++;
  }
  return parts.length > 0 ? `${parts.join(" و ")} تومان` : "";
}
