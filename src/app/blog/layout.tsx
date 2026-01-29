import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, insights, and stories from The Elysium Project. Explore our thoughts on web design, development, AI, and digital strategy.',
  openGraph: {
    title: 'Blog | The Elysium Project',
    description: 'News, insights, and stories from The Elysium Project.',
  },
  twitter: {
    title: 'Blog | The Elysium Project',
    description: 'News, insights, and stories from The Elysium Project.',
  }
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
