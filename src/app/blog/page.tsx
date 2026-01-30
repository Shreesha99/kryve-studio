'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { getPosts, type Post } from '@/lib/blog';
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
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { AnimatedGradient } from '@/components/common/animated-gradient';
import { BlogGenerator } from '@/components/blog/blog-generator';
import { BlogPageSkeleton } from '@/components/blog/blog-page-skeleton';
import { KeyboardAnimation } from '@/components/blog/keyboard-animation';

gsap.registerPlugin(ScrollTrigger);

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <AnimateOnScroll delay={`${index * 150}ms`}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
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
            <CardDescription className="mt-2 text-base line-clamp-3">{post.excerpt}</CardDescription>
          </CardContent>
          <CardFooter className="p-6 pt-0 text-sm text-muted-foreground">
            <p>
              By {post.author}
            </p>
          </CardFooter>
        </Card>
      </Link>
    </AnimateOnScroll>
  );
}

function FeaturedPostCard({ post }: { post: Post }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const image = card.querySelector('img');
        if (!image) return;

        // This makes the image slightly larger than its container, giving it room to move.
        gsap.set(image, { scale: 1.15 });

        // This animates the image's vertical position as the user scrolls, creating a parallax effect.
        gsap.to(image, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            }
        });
    }, []);

  return (
    <AnimateOnScroll>
        <Link href={`/blog/${post.slug}`} className="group block">
            <Card ref={cardRef} className="overflow-hidden md:grid md:grid-cols-2 md:items-center transition-all duration-300 hover:shadow-2xl">
                <CardHeader className="p-0 h-80 md:h-full">
                    <div className="w-full h-full overflow-hidden">
                        <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={800}
                        height={600}
                        className="h-full w-full object-cover"
                        data-ai-hint={post.imageHint}
                        priority
                        />
                    </div>
                </CardHeader>
                <div className="p-8 md:p-12">
                    <CardContent className="p-0">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">Featured Article</p>
                        <CardTitle className="font-headline text-3xl md:text-4xl">{post.title}</CardTitle>
                        <CardDescription className="mt-4 text-lg text-muted-foreground line-clamp-4">{post.excerpt}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-0 pt-6">
                        <div className="w-full">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>By {post.author}</span>
                                <span>{new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}</span>
                            </div>
                            <Button variant="link" className="group/link p-0 mt-4 h-auto text-lg text-primary">
                                Read More <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/link:translate-x-1" />
                            </Button>
                        </div>
                    </CardFooter>
                </div>
            </Card>
      </Link>
    </AnimateOnScroll>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      delay: 0.2
    });

    if (titleRef.current && paragraphRef.current) {
        tl.from(titleRef.current, { y: 30, opacity: 0, duration: 1, ease: 'power3.out' })
          .from(paragraphRef.current, { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7');
    }

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <AnimatedGradient className="opacity-20 dark:opacity-10" />
      <Header />
      <main className="relative z-10 flex-1">
        <section
          ref={sectionRef}
          className="container mx-auto max-w-7xl px-4 py-16 pt-32 md:px-6 md:py-24 md:pt-48"
        >
          <div className="space-y-4 text-center">
            <h1
              ref={titleRef}
              className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl"
            >
                From The Project
            </h1>
            <p
              ref={paragraphRef}
              className="mx-auto max-w-2xl text-muted-foreground md:text-xl"
            >
              News, insights, and stories from the team at The Elysium Project.
            </p>
          </div>

          <div className="mt-16 space-y-16">
              {loading ? (
                <BlogPageSkeleton />
              ) : (
                <>
                  {featuredPost && <FeaturedPostCard post={featuredPost} />}

                  {otherPosts.length > 0 && (
                    <>
                        <h2 className="font-headline text-3xl font-semibold tracking-tight mt-16">More Articles</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                            {otherPosts.map((post, index) => (
                            <PostCard key={post.slug} post={post} index={index} />
                            ))}
                        </div>
                    </>
                  )}

                  {!featuredPost && !loading && (
                    <AnimateOnScroll>
                      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted bg-card/50 p-12 text-center">
                        <KeyboardAnimation className="mb-4" />
                        <h2 className="font-headline text-3xl font-semibold">Our Keys are Warming Up</h2>
                        <p className="mt-3 max-w-md text-muted-foreground md:text-lg">
                          Type to warm our keys up for our first blog article. Who knows, we might consider it in one of our blogs 😉
                        </p>
                      </div>
                    </AnimateOnScroll>
                  )}
                </>
              )}
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
