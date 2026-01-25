import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPostBySlug, posts } from '@/lib/blog-posts';
import { Header } from '@/components/common/header';
import { Footer } from '@/components/common/footer';
import { Metadata } from 'next';

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Kryve Studio`,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <article className="container mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
          <div className="space-y-4 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
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

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
