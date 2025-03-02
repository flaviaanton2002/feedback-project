import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { headers } from "next/headers";

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
          <main className="mx-auto max-w-4xl">
            <header className="flex gap-8 text-gray-600 h-24 items-center">
              <Link href="" className="text-primary font-bold text-xl">
                FeedbackBoard
              </Link>
              <nav className="flex gap-4 grow">
                <Link href={"/"}>Home</Link>
                <Link href={"/pricing"}>Pricing</Link>
                <Link href={"/help"}>Help</Link>
              </nav>
              <nav className="flex gap-4 items-center">
                <Link href={"/login"}>Login</Link>
                <Link
                  href={"/register"}
                  className="bg-primary text-white px-4 py-2 rounded-lg"
                >
                  Sign up
                </Link>
              </nav>
            </header>
            {children}
          </main>
        )}
      </body>
    </html>
  );
}
