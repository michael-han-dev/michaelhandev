import type { Metadata } from "next";
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
      { url: "/softletterm.png", sizes: "any" },
      { url: "/icon.png", sizes: "any" },
    ],
    shortcut: "/softletterm.png",
    apple: "/softletterm.png",
  },
  openGraph: {
    title: "michaelhandev",
    description: "michael's portfolio",
    images: ["/softletterm.png"],
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
        <link rel="icon" type="image/png" href="/softletterm.png" />
        <link rel="shortcut icon" type="image/png" href="/softletterm.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
