import type { Metadata } from "next";
import { Inter, Sora, JetBrains_Mono, Oswald } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { StickyCTA } from "@/components/ui/StickyCTA";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Web Automate | Design-Led Automation Studio",
  description: "Web Automate helps businesses grow revenue by building high-converting websites and automating business processes.",
  keywords: "automation, web development, business systems, revenue engineering, client portal",
  authors: [{ name: "Web Automate" }],
  creator: "Web Automate",
  publisher: "Web Automate",
  robots: "index, follow",
  openGraph: {
    title: "Web Automate | Design-Led Automation Studio",
    description: "Web Automate helps businesses grow revenue by building high-converting websites and automating business processes.",
    type: "website",
    locale: "en_US",
    siteName: "Web Automate",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Automate | Design-Led Automation Studio",
    description: "Web Automate helps businesses grow revenue by building high-converting websites and automating business processes.",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#0033CC",
  manifest: "/site.webmanifest",
};

import { AppLayout } from "@/components/layout/AppLayout";
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
          oswald.variable,
          jetbrainsMono.variable
        )}
      >
        <SmoothScroll />
        
        <AppLayout
          navbar={<Navbar />}
          footer={<Footer />}
          stickyCTA={<StickyCTA />}
        >
          {children}
        </AppLayout>

        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
      </body>
    </html>
  );
}
