'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, type Post } from '@/lib/blog';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { PageLoader } from '@/components/common/page-loader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      getPostBySlug(slug)
        .then((p) => {
          if (p) {
            setPost(p);
            document.title = `${p.title} | The Elysium Project`;
          } else {
            notFound();
          }
        })
        .catch(() => notFound())
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return <PageLoader />;
  }

  if (!post) {
    // This will be handled by notFound(), but as a fallback:
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <article className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="pl-0 text-muted-foreground hover:text-foreground"
            >
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to all articles
              </Link>
            </Button>
          </div>
          <div className="space-y-4 text-center">
            <h1 className="font-headline text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              {post.title}
            </h1>
            <p className="text-muted-foreground md:text-xl">
              By {post.author} on{' '}
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="relative my-12 h-64 w-full overflow-hidden rounded-lg shadow-xl md:h-96">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint={post.imageHint}
              priority
            />
          </div>

          <div
            className="prose prose-lg dark:prose-invert mx-auto max-w-none [&_p]:mb-4 [&_p]:text-lg [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
