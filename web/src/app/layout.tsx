import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import clsx from 'clsx';
import { RedModeProvider } from "@/context/RedModeContext";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { NativeLifecycleManager } from "@/components/native/NativeLifecycleManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aurora.app'),
  title: "Aurora - Should I go out?",
  description: "Real-time aurora borealis decision support. Minimize false positives. Optimize for cold fingers.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aurora",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Aurora - Should I go out?",
    description: "Real-time aurora decision engine.",
    url: "https://aurora.app",
    siteName: "Aurora",
    images: [
      {
        url: "/og-image.png", // We need to create this placeholder or use icon
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Critical for app-like feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={clsx(
          geistSans.variable,
          geistMono.variable,
          "antialiased selection:bg-red-900 selection:text-white"
        )}
      >
        <RedModeProvider>
          {children}
          <ServiceWorkerRegister />
          <NativeLifecycleManager />
        </RedModeProvider>
      </body>
    </html>
  );
}
