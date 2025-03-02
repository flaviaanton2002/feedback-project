import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { headers } from "next/headers";
import LandingHeader from "./components/LandingHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Feedback boards",
  description: "",
};

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const path = new URL(referer).pathname;
  const isBoardPage = path.startsWith("/board/");
  return (
    <html lang="en">
      <body
        className={
          `${geistSans.variable} ${geistMono.variable} antialiased` +
          (isBoardPage ? "" : "bg-bgGray")
        }
      >
        {isBoardPage && <>{children}</>}
        {!isBoardPage && (
          <main className="mx-auto max-w-4xl px-4">
            <LandingHeader />
            {children}
          </main>
        )}
      </body>
    </html>
  );
}
