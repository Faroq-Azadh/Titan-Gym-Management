interface TrustItem {
  num: string;
  label: string;
}

interface TrustRowProps {
  items: TrustItem[];
}

export function TrustRow({ items }: TrustRowProps) {
  return (
    <div className="flex items-center gap-6">
      {items.map((item) => (
        <div key={item.label} className="flex items-baseline gap-[5px]">
          <span className="text-lg font-extrabold text-white">{item.num}</span>
          <span className="text-xs text-[#94A3B8]">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export const loginTrustItems: TrustItem[] = [
  { num: "۵۰۰+", label: "باشگاه فعال" },
  { num: "۵۰هزار+", label: "ورزشکار" },
  { num: "۹۹.۹٪", label: "پایداری" },
];

export const registerTrustItems: TrustItem[] = [
  { num: "۵۰۰+", label: "باشگاه فعال" },
  { num: "۱۴ روز", label: "استفاده رایگان" },
  { num: "۹۹.۹٪", label: "پایداری" },
];
