import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/common/app-providers";
import { cn } from "@/lib/utils";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { CustomCursor } from "@/components/common/custom-cursor";

const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><style>.line{stroke:hsl(240 10% 3.9%)}@media (prefers-color-scheme:dark){.line{stroke:hsl(0 0% 98%)}}</style><path class="line" d="M25,18.33A7.5,7.5 0 0,1 17.5,25.83H7.5V7.5H17.5A7.5,7.5 0 0,1 25,15V18.33Z" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

const siteConfig = {
  name: "The Elysium Project",
  url: "https://www.the-elysium-project.in",
  ogImage: "https://www.the-elysium-project.in/og-image.png", // IMPORTANT: You should host your own OG image
  description:
    "The Elysium Project is a premium digital studio specializing in web design, development, and branding. We build beautiful, high-performance websites with Next.js and React that drive results and create lasting impact.",
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
    creator: "@the_elysium_project", // IMPORTANT: Replace with your actual Twitter handle.
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
  icons: {
    icon: faviconDataUri,
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Poppins:wght@600;700;800&family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={cn("font-body antialiased")}>
        <AppProviders>
          {/* <CustomCursor /> */}
          {children}
          <ScrollToTop />
        </AppProviders>
      </body>
    </html>
  );
}
