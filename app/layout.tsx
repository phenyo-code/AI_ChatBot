import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "./SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lwazi - Intelligent Chat Companion",
  description:
    "Lwazi is your AI-powered companion for sparking creativity, exploring ideas, and solving problems, built with Groq’s advanced technology.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900`}
      >
        <SessionWrapper>{children}</SessionWrapper>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1E40AF",
              color: "#F3F4F6",
              border: "1px solid #3B82F6",
              borderRadius: "8px",
              padding: "12px",
            },
          }}
        />
      </body>
    </html>
  );
}