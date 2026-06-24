import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "review-rescue — a brutal review in, three perfect replies out",
  description:
    "Paste any customer review and get an instant risk read plus three send-ready replies. Safe, on-brand, and fast — built for local businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-aurora bg-fixed text-txt font-body">{children}</body>
    </html>
  );
}
