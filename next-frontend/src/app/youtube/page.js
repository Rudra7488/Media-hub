import React from "react";
import YoutubeDownloader from "@/components/YoutubeDownloader";

export const metadata = {
  title: "YouTube Shorts & Video Downloader | InstaViewer",
  description: "Download high-quality YouTube Shorts, videos, and extract MP3 audio locally securely.",
  keywords: "youtube shorts download, yt mp4 downloader, yt to mp3, youtube saver",
};

export default function YoutubePage() {
  return (
    <main className="container mx-auto px-4 pb-20">
      <YoutubeDownloader />
    </main>
  );
}
