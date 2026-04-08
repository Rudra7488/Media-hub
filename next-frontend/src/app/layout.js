import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MediaDash - High-Speed Media Downloader",
  description: "Securely download YouTube videos in 1080p and high-quality MP4 formats through a sleek, fast, and modern interface.",
  keywords: "youtube downloader, 1080p download, hd video downloader, media dash",
};

import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
        <Navbar />
        {children}
        <footer className="py-8 border-t mt-auto border-white/5 text-center text-slate-500 backdrop-blur-sm bg-black/20">
          <p className="text-xs font-black uppercase tracking-[0.3em]">MediaDash © 2026</p>
        </footer>
      </body>
    </html>
  );
}
