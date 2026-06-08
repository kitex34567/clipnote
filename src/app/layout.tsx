import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClipNote — Überall. Sofort. Synchron.",
  description: "Speichere Text, Links und Notizen geräteübergreifend in Echtzeit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="h-full">
      <body className={`${geist.className} antialiased min-h-full`}>{children}</body>
    </html>
  );
}
