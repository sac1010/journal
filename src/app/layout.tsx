import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Journal — Your Private Daily Journal",
    template: "%s | Journal",
  },
  description:
    "A simple, private online journal to capture your thoughts, track your mood, and reflect on your life. Free to use. Your entries are yours alone.",
  keywords: [
    "online journal",
    "private journal app",
    "daily journal",
    "digital diary",
    "free journal app",
    "journaling for mental health",
    "personal journal online",
    "simple journal app",
  ],
  metadataBase: new URL("https://journal-three-blush.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "Journal",
    title: "Journal — Your Private Daily Journal",
    description:
      "A simple, private online journal to capture your thoughts, track your mood, and reflect on your life.",
    url: "https://journal-three-blush.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal — Your Private Daily Journal",
    description:
      "A simple, private online journal to capture your thoughts, track your mood, and reflect on your life.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
