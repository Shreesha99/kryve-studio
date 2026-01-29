import { Metadata } from 'next';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Services } from '@/components/sections/services';
import { Work } from '@/components/sections/work';
import { Contact } from '@/components/sections/contact';

// The root metadata is defined in layout.tsx
// We can override it for specific pages like this.
export const metadata: Metadata = {
  title: "The Elysium Project | Premium Web Design & Development",
  description: "A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful, brilliant, and drive results.",
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Elysium Project',
  url: 'https://www.the-elysium-project.in',
  logo: 'https://www.the-elysium-project.in/logo.png', // IMPORTANT: Replace with your actual logo URL
  description: 'The Elysium Project is a premium digital studio specializing in web design, development, and branding. We build beautiful, high-performance websites that drive results.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '100 MG Road', // IMPORTANT: Replace with your address
    addressLocality: 'Bengaluru',
    addressRegion: 'KA',
    postalCode: '560001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-999-999-9999', // IMPORTANT: Replace with your phone number
    contactType: 'Customer Service',
    email: 'hello@the-elysium-project.in'
  },
  sameAs: [ // IMPORTANT: Replace with your actual social media URLs
    'https://instagram.com/the_elysium_project',
    'https://linkedin.com/company/the-elysium-project'
  ]
};


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
