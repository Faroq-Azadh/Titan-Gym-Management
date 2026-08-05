import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "درخواست ثبت باشگاه — تیتان",
  description: "ثبت درخواست باشگاه جدید در پلتفرم تیتان",
};

export default function RegisterGymLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
