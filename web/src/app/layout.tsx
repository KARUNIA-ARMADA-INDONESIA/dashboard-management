import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { TopNavbar } from "@/components/layout/top-navbar";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KARUNIA Management Dashboard",
  description:
    "Akses dashboard, monitoring, dan laporan seluruh departemen Karunia dalam satu tempat.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Suspense fallback={<div className="h-16 border-b bg-background/95" />}>
          <TopNavbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
