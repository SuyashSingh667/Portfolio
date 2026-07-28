import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myselfsuyash.vercel.app"),
  title: "Suyash Singh — Creative Developer & Full Stack Engineer",
  description: "Portfolio of Suyash Singh. B.Tech Computer Science student specializing in Cloud Computing, WebGL/Three.js interactive web applications, and Full-Stack Engineering.",
  openGraph: {
    title: "Suyash Singh — Creative Developer & Full Stack Engineer",
    description: "Interactive portfolio featuring WebGL 3D graphics, full-stack projects, and real-time interactive experiences.",
    url: "https://myselfsuyash.vercel.app",
    siteName: "Suyash Singh Portfolio",
    images: [
      {
        url: "/og-image.png?v=3",
        width: 1200,
        height: 630,
        alt: "Suyash Singh Portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suyash Singh — Creative Developer & Full Stack Engineer",
    description: "Interactive portfolio featuring WebGL 3D graphics, full-stack projects, and real-time interactive experiences.",
    images: ["/og-image.png?v=3"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&amp;family=Archivo+Narrow:wght@600;700&amp;family=Caveat:wght@600;700&amp;family=Patrick+Hand&amp;display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
