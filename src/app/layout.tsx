import type { Metadata } from "next";
import "./globals.css";
import { BASE_URL } from "@/lib/config";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: {
    default: "Journal — AI-Powered Private Journal",
    template: "%s | Journal",
  },
  description:
    "A private online journal powered by AI. Get personalised writing prompts, post-entry reflections, weekly summaries, and ask questions about your own past — all in a calm, distraction-free space.",
  keywords: [
    "AI journal app",
    "AI-powered journaling",
    "private journal app",
    "online journal with AI",
    "smart daily journal",
    "AI reflection journal",
    "digital diary with AI",
    "free AI journal",
    "journaling for mental health",
    "personal journal online",
    "ask your journal",
    "weekly summary journal",
  ],
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    siteName: "Journal",
    title: "Journal — AI-Powered Private Journal",
    description:
      "A private journal with AI-powered prompts, reflections, weekly summaries, and a Q&A over your own past entries.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Journal — AI-Powered Private Journal",
    description:
      "A private journal with AI-powered prompts, reflections, weekly summaries, and a Q&A over your own past entries.",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "fNgRdmf2peCjX5oVHnwMHv3Q5Ro65xqyqYI8rFzHJ4o",
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
