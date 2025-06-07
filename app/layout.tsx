import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from '@/components/layout/header'
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yamada Portfolio - フルスタック開発者",
  description: "フルスタック開発者のポートフォリオサイト。技術ブログ、プロジェクト紹介、スキルセットを掲載しています。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
