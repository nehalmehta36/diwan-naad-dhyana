import type { Metadata } from "next";
import { Cormorant_Garamond, Assistant, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
});

const assistant = Assistant({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-assistant",
});

const notoDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600"],
  variable: "--font-noto-devanagari",
});

export const metadata: Metadata = {
  title: "Diwan Naad Dhyana — Naad Yoga Sound Meditation",
  description:
    "Experience the healing power of Naad Yoga with Diwan Naad Dhyana, founded by Nehal Sati. Book a personal or community sound meditation session.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${assistant.variable} ${notoDevanagari.variable}`}
    >
      <body className="font-body">{children}</body>
    </html>
  );
}
