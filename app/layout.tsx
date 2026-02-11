import "./globals.css";
import React from "react";

export const metadata = {
  title: "AI UI Generator",
  description: "Deterministic AI Agent → UI Generator",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
