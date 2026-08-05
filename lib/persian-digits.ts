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

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (digit) => PERSIAN_DIGIT_MAP[digit]);
}

export function normalizeDigits(value: string): string {
  return value.replace(/[^0-9۰-۹]/g, "").replace(/[۰-۹]/g, (char) => {
    const code = char.charCodeAt(0) - "۰".charCodeAt(0);
    return String(code);
  });
}
