import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";


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

        {children}
      </body>
    </html>
  );
}
