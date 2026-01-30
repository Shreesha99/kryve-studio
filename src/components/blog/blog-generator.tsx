'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gsap } from 'gsap';
import {
  generateBlogPost,
  type GenerateBlogPostOutput,
} from '@/ai/flows/generate-blog-post';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Loader2,
  Copy,
  Download,
  Check,
} from 'lucide-react';
import { AnimateOnScroll } from '../common/animate-on-scroll';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  topic: z.string().min(5, {
    message: 'Topic must be at least 5 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

function GeneratedPostSkeleton() {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shimmer = shimmerRef.current;
    if (!shimmer) return;
    gsap.fromTo(
      shimmer,
      { x: '-100%' },
      {
        x: '100%',
        duration: 1.5,
        repeat: -1,
        ease: 'power1.inOut',
      }
    );
  }, []);
  
  return (
    <AnimateOnScroll>
      <Card className="relative mx-auto mt-12 max-w-none overflow-hidden rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
        <div className="absolute inset-0 z-10" ref={shimmerRef}>
          <div className="h-full w-full bg-gradient-to-r from-transparent via-muted/10 to-transparent" />
        </div>
        <CardHeader className="p-0">
          <Skeleton className="h-8 w-3/4 rounded-md" />
        </CardHeader>
        <CardContent className="mt-6 space-y-3 p-0">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <br />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/6" />
        </CardContent>
      </Card>
    </AnimateOnScroll>
  );
}

function GeneratedPostResult({ post }: { post: GenerateBlogPostOutput }) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (post && resultRef.current) {
      const contentParas = gsap.utils.toArray('p', contentRef.current);

      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(resultRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(titleRef.current, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7 }, "-=0.5")
        .fromTo(buttonsRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }, "<")
        .fromTo(contentParas, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 }, "-=0.5");
    }
  }, [post]);

  const handleCopy = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    const textToCopy = `Title: ${post.title}\n\n${
      tempDiv.textContent || ''
    }`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2500);
    });
  };

  const handleDownload = async () => {
    const { default: jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;

    const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.textContent || '');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    const titleLines = doc.splitTextToSize(post.title, 180);
    doc.text(titleLines, 15, 20);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);

    let yPosition = 20 + (titleLines.length * 10) + 10;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    paragraphs.forEach(para => {
        if (!para.trim()) return;

        const splitText = doc.splitTextToSize(para, 180);

        if (yPosition + (splitText.length * 7) > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
        }

        splitText.forEach((line: string) => {
            doc.text(line, 15, yPosition);
            yPosition += 7;
        });
        yPosition += 7;
    });
    
    doc.save(`${post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').substring(0, 30)}.pdf`);
  };

  return (
    <article
      ref={resultRef}
      className="mx-auto mt-12 max-w-none rounded-lg border bg-card p-8 text-card-foreground shadow-sm opacity-0"
    >
      <CardHeader className="flex-row items-start justify-between p-0">
        <CardTitle ref={titleRef} className="font-headline text-3xl">{post.title}</CardTitle>
        <div ref={buttonsRef} className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy post"
          >
            {copyStatus === 'copied' ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDownload}
            aria-label="Download post"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent
        ref={contentRef}
        className="prose prose-lg dark:prose-invert mx-auto mt-4 max-w-none p-0 [&_p]:mb-4 [&_p]:text-lg [&_p]:leading-relaxed"
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      />
    </article>
  );
}

export function BlogGenerator() {
  const [generatedPost, setGeneratedPost] =
    useState<GenerateBlogPostOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsLoading(true);
    setError(null);
    setGeneratedPost(null);
    try {
      const post = await generateBlogPost({ topic: values.topic });
      setGeneratedPost(post);
    } catch (e) {
      setError('Failed to generate blog post. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 pb-16 md:px-6 md:pb-24">
      <div className="space-y-4 text-center">
        <h2 className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl">
          AI Blog Post Generator
        </h2>
        <p className="text-muted-foreground md:text-xl">
          Need inspiration for your next company update? Enter a topic below and
          let our AI craft a compelling article for you.
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-2xl">
        <CardHeader>
          <CardTitle>Create a New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Post Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'The impact of AI on modern design'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Post'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <GeneratedPostSkeleton />}

      {error && !isLoading && (
        <p className="mt-8 text-center text-destructive">{error}</p>
      )}

      {generatedPost && !isLoading && <GeneratedPostResult post={generatedPost} />}
    </div>
  );
}
