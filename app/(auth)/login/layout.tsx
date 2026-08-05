import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود — تیتان",
  description: "ورود به پنل مدیریت باشگاه تیتان",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
