import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "通勤风穿搭板 - Outfit Planner",
  description: "AI驱动的一周通勤穿搭规划工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen bg-white">
          <nav className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex space-x-8">
                  <Link
                    href="/"
                    className="text-xl font-semibold text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    通勤风穿搭板
                  </Link>
                  <Link
                    href="/closet"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    衣柜管理
                  </Link>
                  <Link
                    href="/plan"
                    className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                  >
                    一周计划
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
