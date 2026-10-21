import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TopBar } from "@/components/top-bar";
import { Footer } from "@/components/footer";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <div className="relative">
          {/* outer margin 16/24/40, then the two side hairlines every page hangs from */}
          <div className="flex min-h-dvh flex-col px-4 t:px-6 d:px-10">
            <div className="flex flex-1 flex-col border-x border-hairline">
              <TopBar />
              <main className="flex-1">{children}</main>
              <div className="mt-16 t:mt-24">
                <Footer />
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 z-50" />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
