import type { Metadata } from "next";
import { Inter } from "next/font/google"; // ✅ Added for professional typography
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-UI Generator",
  description: "Deterministic AI Agent → UI Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Applied Inter font + consistent background color */}
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  );
}