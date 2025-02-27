import type { Metadata } from "next";
import {Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Social Fusion",
  description: "Social Media Site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className={inter.className}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-end">
            <Header />
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
