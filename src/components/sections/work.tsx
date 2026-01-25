import Image from 'next/image';
import { Projects } from '@/lib/placeholder-images';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimateOnScroll } from '../common/animate-on-scroll';

export function Work() {
  const projects = Projects;

  return (
    <section id="work" className="w-full bg-secondary py-24 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <AnimateOnScroll className="mb-16 text-center">
          <h2 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl">
            Featured Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            A selection of projects that showcase our passion for digital excellence.
          </p>
        </AnimateOnScroll>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {projects.map((project, index) => (
            <AnimateOnScroll key={project.id} delay={`${index * 150}ms`}>
              <Card className="overflow-hidden transition-all hover:shadow-xl">
                <CardHeader className="p-0">
                  <div className="aspect-video w-full overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.description}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      data-ai-hint={project.imageHint}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="font-headline text-2xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
                </CardContent>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
