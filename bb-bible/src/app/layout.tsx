import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BB - Beautiful Bible",
  description: "아름다운 성경 읽기 서비스",
  manifest: "/manifest.json",
  themeColor: "#D2CFC8",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BB",
  },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/favicon.ico", // 임시로 favicon 사용
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen safe-area-full`}
        style={{ backgroundColor: '#F0EEE7' }}
      >
        <main className="pb-28 safe-area-top">
          {children}
        </main>
        <BottomNavigation />
      </body>
    </html>
  );
}
