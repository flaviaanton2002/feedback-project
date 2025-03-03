import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import AuthProvider from "./hooks/AuthProvider";
import { AppContextProvider } from "./hooks/AppContext";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="mx-auto max-w-4xl px-4">
          <AppContextProvider>
            <AuthProvider>
              <Header />
              {children}
            </AuthProvider>
          </AppContextProvider>
        </div>
      </body>
    </html>
  );
}
