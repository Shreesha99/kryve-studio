import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/common/app-providers";
import { cn } from "@/lib/utils";
import { ScrollToTop } from "@/components/common/scroll-to-top";
import { CustomCursor } from "@/components/common/custom-cursor";

// A theme-aware, custom SVG favicon that represents a stylized 'E'
const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><style>.line{stroke:hsl(240 10% 3.9%)}@media (prefers-color-scheme:dark){.line{stroke:hsl(0 0% 98%)}}</style><path class="line" d="M25 7H7V13H20V19H7V25H25" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

export const metadata: Metadata = {
  title: {
    default: "The Elysium Project | Engineering Elegance. Designing Impact.",
    template: "%s | The Elysium Project",
  },
  description:
    "A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful, brilliant, and drive results.",
  metadataBase: new URL("https://elysium-project.example.com"),
  openGraph: {
    title: "The Elysium Project",
    description:
      "A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful and brilliant.",
    url: "https://elysium-project.example.com",
    siteName: "The Elysium Project",
    images: [
      {
        url: "https://picsum.photos/seed/elysium-og/1200/630",
        width: 1200,
        height: 630,
        alt: "The Elysium Project Hero Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Elysium Project",
    description:
      "A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful and brilliant.",
    images: ["https://picsum.photos/seed/elysium-og/1200/630"],
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
