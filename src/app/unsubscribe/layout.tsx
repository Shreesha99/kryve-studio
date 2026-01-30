import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unsubscribe',
  description: 'Unsubscribe from The Elysium Project newsletter.',
  // Prevent this page from being indexed by search engines
  robots: {
    index: false,
    follow: false,
  }
};

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
