import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import InteractiveBackground from "@/components/InteractiveBackground";

export const metadata: Metadata = {
  title: "我的电子衣柜 - Outfit Planner",
  description: "有了电子衣柜，随时随地衣物搭配",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen">
          <div className="fixed inset-0 -z-10">
            <InteractiveBackground />
          </div>
          <nav className="border-b border-white/10 backdrop-blur-sm bg-black/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex space-x-8">
                  <Link
                    href="/"
                    className="text-xl font-bold hover:opacity-80 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(90deg, #fef08a, #c4b5fd, #93c5fd, #5eead4, #f9a8d4, #fb923c)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      backgroundSize: '200% 100%',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
                    }}
                  >
                    我的电子衣柜
                  </Link>
                  <Link
                    href="/closet"
                    className="text-white/70 hover:text-white transition-all duration-300 flex items-center drop-shadow-md"
                  >
                    衣柜管理
                  </Link>
                  <Link
                    href="/plan"
                    className="text-white/70 hover:text-white transition-all duration-300 flex items-center drop-shadow-md"
                  >
                    一周计划
                  </Link>
                  <Link
                    href="/about"
                    className="text-white/70 hover:text-white transition-all duration-300 flex items-center drop-shadow-md"
                  >
                    关于
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
