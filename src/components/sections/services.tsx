import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimateOnScroll } from '../common/animate-on-scroll';

const services = [
  {
    icon: <span className="material-symbols-outlined text-5xl text-primary">palette</span>,
    title: 'Web Design',
    description: 'Creating visually stunning and user-friendly interfaces that tell your story.',
  },
  {
    icon: <span className="material-symbols-outlined text-5xl text-primary">code_blocks</span>,
    title: 'Web Development',
    description: 'Building robust, scalable, and high-performance websites and applications.',
  },
  {
    icon: <span className="material-symbols-outlined text-5xl text-primary">rocket_launch</span>,
    title: 'Brand Identity',
    description: 'Crafting unique brand identities that resonate with your target audience.',
  },
  {
    icon: <span className="material-symbols-outlined text-5xl text-primary">storefront</span>,
    title: 'E-commerce Solutions',
    description: 'Developing powerful e-commerce platforms that drive sales and growth.',
  },
];

export function Services() {
  return (
    <section id="services" className="w-full bg-background py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimateOnScroll className="mb-16 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Our Expertise
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We offer a comprehensive suite of services to bring your digital vision to life.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <AnimateOnScroll key={service.title} delay={`${index * 150}ms`}>
              <Card className="h-full text-center transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="items-center">
                  {service.icon}
                  <CardTitle className="mt-4 font-headline text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
