import { AnimateOnScroll } from '../common/animate-on-scroll';
import { PenTool, CodeXml, Users } from 'lucide-react';

const principles = [
  {
    icon: PenTool,
    title: 'Purposeful Design',
    description: "Beyond aesthetics, we craft intuitive experiences that tell a compelling story and guide users with purpose.",
    svgPath: "M20,50 Q40,20 60,50 T100,50",
  },
  {
    icon: CodeXml,
    title: 'Precision Engineering',
    description: "Our code is as clean as our designs. We build robust, scalable, and performant applications for a seamless experience.",
    svgPath: "M20,50 L40,30 L60,70 L80,30 L100,50",
  },
  {
    icon: Users,
    title: 'Creative Partnership',
    description: "We are your creative partner, collaborating closely to transform your vision into a digital reality.",
    svgPath: "M30,70 C30,30 90,30 90,70",
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
                <AnimateOnScroll key={item.title} delay={`${index * 150}ms`} className="relative text-center">
                    <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden opacity-5" aria-hidden="true">
                        <svg viewBox="0 0 120 100" className="h-full w-full scale-125 transform">
                            <path 
                                d={item.svgPath}
                                stroke="hsl(var(--primary))" 
                                fill="none" 
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeDasharray="500"
                                strokeDashoffset="500"
                                className="animate-path-draw"
                            />
                        </svg>
                    </div>
                    <div className="mb-6 flex justify-center">
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-primary/10 bg-primary/5 p-4 backdrop-blur-sm">
                        <div className="absolute inset-0 scale-90 rounded-full border-2 border-primary/10"></div>
                        <item.icon className="h-10 w-10 text-primary" strokeWidth={1.5} />
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
