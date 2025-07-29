import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-serif",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "michaelhandev",
  description: "michael's portfolio",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "michaelhandev",
    description: "michael's portfolio",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "Michael Han - Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "michaelhandev",
    description: "michael's portfolio",
    images: ["/icon.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
