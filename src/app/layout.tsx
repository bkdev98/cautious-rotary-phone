import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Toaster } from "sonner";
import { FeedbackFab } from "@/components/layout/feedback-fab";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Khoa Thương Mại - Du Lịch | IUH",
  description: "Hệ thống quản lý hồ sơ tốt nghiệp - Trường Đại học Công nghiệp TP.HCM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnamPro.variable} antialiased`}>
        {children}
        <FeedbackFab />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
