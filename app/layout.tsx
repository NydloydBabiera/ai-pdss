import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/_elements/loadingScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-PDSS",
  description: "AI assisted personalized learning system for students",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-sans antialiased">
        {/* <GlobalLoadingModal /> */}
        <LoadingProvider>{children}</LoadingProvider>

        {/* <Notification /> */}
      </body>
    </html>
  );
}
