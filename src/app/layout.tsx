import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adaptive Workspace für Kanzleien",
  description: "KI-gestützter Workspace für Kanzleien: Research, Meetings, Deliverables und Stakeholder-Signale je Mandat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Adaptive Workspace
            </Link>
            <nav className="flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-slate-900">
                Mandate
              </Link>
              <Link href="/privacy" className="hover:text-slate-900">
                Privacy Center
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
          Lokale SQLite-Datenhaltung · DSGVO-Maßnahmen im Privacy Center
        </footer>
      </body>
    </html>
  );
}
