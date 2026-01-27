'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { BlogGenerator } from '@/components/blog/blog-generator';
import { posts, type Post } from '@/lib/blog-posts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AnimateOnScroll } from '@/components/common/animate-on-scroll';
import { Separator } from '@/components/ui/separator';

gsap.registerPlugin(ScrollTrigger);

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <AnimateOnScroll delay={`${index * 150}ms`}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:shadow-xl">
          <CardHeader className="p-0">
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                data-ai-hint={post.imageHint}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-6">
            <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
            <CardDescription className="mt-2 text-base">{post.excerpt}</CardDescription>
          </CardContent>
          <CardFooter className="p-6 pt-0 text-sm text-muted-foreground">
            <p>
              {post.author} &bull;{' '}
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </CardFooter>
        </Card>
      </Link>
    </AnimateOnScroll>
  );
}

export default function BlogPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    if (titleRef.current) {
      const titleSpans = gsap.utils.toArray('span', titleRef.current);
      contentTl.fromTo(
        titleSpans,
        { yPercent: 120 },
        { yPercent: 0, stagger: 0.1, duration: 1.2, ease: 'power3.out' }
      );
    }
    if (paragraphRef.current) {
      contentTl.fromTo(
        paragraphRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8'
      );
    }

    return () => {
      contentTl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section
          ref={sectionRef}
          className="container mx-auto max-w-7xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-48"
        >
          <div className="space-y-4 text-center">
            <h1
              ref={titleRef}
              className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl"
            >
              <div className="overflow-hidden py-1">
                <span className="inline-block">From the Studio</span>
              </div>
            </h1>
            <p
              ref={paragraphRef}
              className="mx-auto max-w-2xl text-muted-foreground opacity-0 md:text-xl"
            >
              News, insights, and stories from the team at Zenith.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        </section>
        <div className="container mx-auto max-w-4xl">
          <Separator className="my-16" />
        </div>
        <BlogGenerator />
      </main>
      <Footer />
    </div>
  );
}
