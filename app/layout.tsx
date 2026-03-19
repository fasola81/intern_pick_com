import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Footer } from "@/components/Footer";
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
  metadataBase: new URL("https://www.internpick.com"),
  title: {
    default: "InternPick.com - Match With the Best Local Talent Fast",
    template: "%s | InternPick",
  },
  description: "The premier platform connecting ambitious high school students with local businesses in Springfield, NJ and surrounding areas.",
  keywords: [
    "high school internships",
    "local talent",
    "student jobs",
    "mentorship",
    "Springfield NJ internships",
    "InternPick",
  ],
  authors: [{ name: "InternPick Team" }],
  creator: "InternPick",
  openGraph: {
    type: "website",
    url: "https://www.internpick.com",
    title: "InternPick.com - Match With the Best Local Talent Fast",
    description: "The premier platform connecting ambitious high school students with local businesses.",
    siteName: "InternPick",
    images: [
      {
        url: "/images/hero_background.png",
        width: 1200,
        height: 630,
        alt: "InternPick - Match With the Best Local Talent Fast",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InternPick.com - Match With the Best Local Talent Fast",
    description: "The premier platform connecting ambitious high school students with local businesses.",
    images: ["/images/hero_background.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme') || 'auto';
            if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `}} />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
        <SpeedInsights />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-9KGGX7WHJL" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-9KGGX7WHJL');
          `}
        </Script>
      </body>
    </html>
  );
}
