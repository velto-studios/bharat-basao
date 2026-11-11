import type { Metadata, Viewport } from "next";
import "@fontsource/baloo-2/600.css";
import "@fontsource/baloo-2/700.css";
import "@fontsource/baloo-2/800.css";
import "@fontsource/mukta/400.css";
import "@fontsource/mukta/600.css";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bharat-basao.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Bharat Basao · Akhand Bharat, ghar ghar se",
  description: "Ek khaali naksha jise followers milkar basate hain. Apne naam ka ghar banao, apne shehar ki gali mein. Ek Velto Studios project.",
  openGraph: {
    title: "Bharat Basao · Akhand Bharat, ghar ghar se",
    description: "Har follower ka ek ghar, uske naam ke saath. Chiku Mistri ke saath naksha basao.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Bharat Basao: Chiku Mistri aur rangeen gali" }],
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#FFF6E9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi-Latn">
      <body>{children}</body>
    </html>
  );
}
