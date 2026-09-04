import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import TelegramInit from "@/components/TelegramInit";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "KITOBXON",
  description: "Kitobni o'qima. Undan fikr yarat.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  let currentUser = null;
  const readingStats = { reading: 0, wantToRead: 0, finished: 0, paused: 0, dropped: 0 };
  
  if (session?.user?.id) {
    const { db } = await import("@/db");
    const { users, userBooks } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    
    const res = await db.select().from(users).where(eq(users.id, session.user.id));
    currentUser = res[0];

    const myBooks = await db.select().from(userBooks).where(eq(userBooks.userId, session.user.id));
    for (const b of myBooks) {
      if (b.status === "reading") readingStats.reading++;
      if (b.status === "want_to_read") readingStats.wantToRead++;
      if (b.status === "finished") readingStats.finished++;
      if (b.status === "paused") readingStats.paused++;
      if (b.status === "dropped") readingStats.dropped++;
    }
  }
  return (
    <html lang="uz">
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FDFBF7]`}
      >
        <TelegramInit />
        <Sidebar isAuthenticated={!!session} readingStats={readingStats} isAdmin={currentUser?.username === "admin"} />
        <Navbar 
          isAuthenticated={!!session} 
          isAdmin={currentUser?.username === "admin"} 
          userDisplayName={currentUser?.displayName ?? undefined} 
          userUsername={currentUser?.username} 
        />
        <div className="pb-20 xl:pb-0 xl:ml-64">
          {children}
        </div>
      </body>
    </html>
  );
}
