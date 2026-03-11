import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ★ここが最重要！デザインファイルを読み込む命令

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Kenpai",
  description: "Funeral donation system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}