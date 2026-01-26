import Link from 'next/link';
import Image from 'next/image';
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
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="space-y-4 text-center">
            <h1 className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl md:text-6xl">
              From the Studio
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground md:text-xl">
              News, insights, and stories from the team at Kryve.
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
