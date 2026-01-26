import { HeroContent } from './hero-content';

export function Hero() {
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden py-32 md:py-48 lg:py-64"
    >
      <div className="container mx-auto px-4 md:px-6">
        <HeroContent />
      </div>
    </section>
  );
}
