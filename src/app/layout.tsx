import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/common/app-providers";
import { cn } from "@/lib/utils";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { CookieBanner } from "@/components/common/cookie-banner";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { Toaster } from "@/components/ui/toaster";
import { EasterEggHint } from "@/components/common/easter-egg-hint";

const siteConfig = {
  name: "The Elysium Project",
  url: "https://www.the-elysium-project.in",
  ogImage: "https://www.the-elysium-project.in/og-image.png",
  description:
    "The Elysium Project is a premium digital studio that blends visionary design with precision engineering. We build beautiful, high-performance websites with Next.js, React, and AI that captivate users and create lasting impact.",
  keywords: [
    "Web Design",
    "Web Development",
    "Branding",
    "Digital Studio",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "UI/UX Design",
    "SEO",
    "Performance Optimization",
    "AI Content Generation",
    "Interactive Web Design",
    "GSAP Animation",
    "Firestore",
    "Genkit",
    "Bengaluru",
    "India",
    "Creative Agency",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Premium Web Design & Development`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `An image representing The Elysium Project's brand of premium web design.`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Premium Web Design & Development`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@the_elysium_project",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        <FirebaseClientProvider>
          <AppProviders>
            {children}
            <ScrollToTop />
          </AppProviders>
          <CookieBanner />
          <Toaster />
          {/* <EasterEggHint /> */}
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
