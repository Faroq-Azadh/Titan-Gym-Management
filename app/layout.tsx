import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "تیتان — مدیریت باشگاه",
  description: "پلتفرم مدیریت باشگاه، عضویت، رزرو و پرداخت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
