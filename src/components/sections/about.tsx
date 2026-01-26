import { AnimateOnScroll } from '../common/animate-on-scroll';

const principles = [
  {
    icon: "draw",
    title: "Design with Intent",
    description: "We believe design is more than aesthetics; it's a strategic tool. Every pixel, transition, and layout is crafted with purpose to guide users and tell a compelling story."
  },
  {
    icon: "integration_instructions",
    title: "Engineer with Precision",
    description: "Our code is as clean as our designs. We build robust, scalable, and performant applications using modern technologies, ensuring a seamless experience on any device."
  },
  {
    icon: "groups",
    title: "Partner in Creation",
    description: "We're not just a service provider; we're your creative partner. We collaborate closely with you at every step, transforming your vision into a digital reality together."
  }
]

export function About() {
  return (
    <section id="about" className="w-full bg-background py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimateOnScroll className="mb-20 text-center">
            <h2 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl">
                Where Artistry Meets Architecture
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-muted-foreground">
                We're a studio founded on a single belief: that the most powerful digital experiences are born at the intersection of beautiful design and flawless engineering.
            </p>
        </AnimateOnScroll>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-3">
            {principles.map((item, index) => (
                <AnimateOnScroll key={item.title} delay={`${index * 150}ms`} className="text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                      </div>
                    </div>
                    <h3 className="font-headline text-2xl font-bold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">{item.description}</p>
                </AnimateOnScroll>
            ))}
        </div>
      </div>
    </section>
  );
}
