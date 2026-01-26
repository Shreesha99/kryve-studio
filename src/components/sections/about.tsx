import Image from 'next/image';
import { Founders } from '@/lib/placeholder-images';
import { AnimateOnScroll } from '../common/animate-on-scroll';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function About() {
  return (
    <section id="about" className="w-full bg-secondary py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimateOnScroll className="mb-16 text-center">
            <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
                Meet The Minds Behind Kryve
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                We are a duo of passionate creators who believe in the power of collaboration to build extraordinary things.
            </p>
        </AnimateOnScroll>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-2">
            {Founders.map((founder, index) => (
                <AnimateOnScroll key={founder.id} delay={`${index * 150}ms`}>
                    <Card className="flex h-full flex-col text-center transition-all hover:shadow-xl hover:-translate-y-1">
                        <CardHeader className="flex items-center justify-center pt-8">
                             <div className="relative h-40 w-40">
                                <Image
                                    src={founder.imageUrl}
                                    alt={founder.name}
                                    fill
                                    className="rounded-full object-cover shadow-lg"
                                    data-ai-hint={founder.imageHint}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-grow flex-col p-6">
                            <h3 className="font-headline text-2xl font-bold">{founder.name}</h3>
                            <p className="text-md font-medium text-primary">{founder.title}</p>
                            <p className="mt-4 text-muted-foreground">{founder.bio}</p>
                        </CardContent>
                    </Card>
                </AnimateOnScroll>
            ))}
        </div>
      </div>
    </section>
  );
}
