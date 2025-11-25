import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habit Tracker - Build Better Habits",
  description: "A comprehensive habit tracking web app with workout planning, progress visualization, and gamification features.",
  keywords: ["habit tracker", "fitness", "workout planner", "progress tracking", "goals"],
  authors: [{ name: "Habit Tracker Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1E90FF",
  manifest: "/manifest.json",
  openGraph: {
    title: "Habit Tracker - Build Better Habits",
    description: "Track your habits, plan workouts, and achieve your goals with our comprehensive habit tracking app.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Habit Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Habit Tracker - Build Better Habits",
    description: "Track your habits, plan workouts, and achieve your goals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
