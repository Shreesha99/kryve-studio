import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Services } from '@/components/sections/services';
import { Work } from '@/components/sections/work';
import { Contact } from '@/components/sections/contact';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'The Elysium Project',
  url: 'https://elysium-project.example.com',
  logo: 'https://elysium-project.example.com/logo.png', // User should replace with actual logo URL
  description: 'A premium digital studio that blends visionary design with precision engineering to create web experiences that are beautiful and brilliant.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '100, MG Road',
    addressLocality: 'Bengaluru',
    addressRegion: 'KA',
    postalCode: '560001',
    addressCountry: 'IN',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-555-5555', // User should replace
    contactType: 'Customer Service',
  },
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
