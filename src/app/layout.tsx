import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '@/components/common/app-providers';
import { cn } from '@/lib/utils';
import { ScrollToTop } from '@/components/common/scroll-to-top';
import { CustomCursor } from '@/components/common/custom-cursor';

export const metadata: Metadata = {
  title: {
    default: 'Zenith Studio | Engineering Elegance. Designing Impact.',
    template: '%s | Zenith Studio',
  },
  description:
    'A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful, brilliant, and drive results.',
  metadataBase: new URL('https://zenith-studio.example.com'),
  openGraph: {
    title: 'Zenith Studio',
    description:
      'A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful and brilliant.',
    url: 'https://zenith-studio.example.com',
    siteName: 'Zenith Studio',
    images: [
      {
        url: 'https://picsum.photos/seed/zenith-og/1200/630',
        width: 1200,
        height: 630,
        alt: 'Zenith Studio Hero Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zenith Studio',
    description:
      'A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful and brilliant.',
    images: ['https://picsum.photos/seed/zenith-og/1200/630'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

const faviconSvg = `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:sans-serif;font-weight:bold;font-size:24px;text-anchor:middle;dominant-baseline:central;fill:hsl(240 10% 3.9%)}@media (prefers-color-scheme:dark){text{fill:hsl(0 0% 98%)}}</style><text x="50%" y="53%">Z</text></svg>`;
const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconDataUri} type="image/svg+xml" />
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
      <body className={cn('font-body antialiased')}>
        <AppProviders>
          <CustomCursor />
          {children}
          <ScrollToTop />
        </AppProviders>
      </body>
    </html>
  );
}
