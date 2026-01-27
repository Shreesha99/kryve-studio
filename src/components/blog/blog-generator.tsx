'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  generateBlogPost,
  type GenerateBlogPostOutput,
} from '@/ai/flows/generate-blog-post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  topic: z.string().min(5, {
    message: 'Topic must be at least 5 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export function BlogGenerator() {
  const [generatedPost, setGeneratedPost] = useState<GenerateBlogPostOutput | null>(null);
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
          Generate compelling articles about company news and insights using the power of AI.
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
                        placeholder="e.g., 'Our new design philosophy for 2024'"
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
                    <span className="material-symbols-outlined mr-2 animate-spin">sync</span>
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

      {error && <p className="mt-8 text-center text-destructive">{error}</p>}

      {generatedPost && (
        <article className="mx-auto mt-12 max-w-none rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
          <h3 className="font-headline text-3xl mb-4">{generatedPost.title}</h3>
          <div
            className="prose prose-lg dark:prose-invert mx-auto max-w-none [&_p]:mb-4 [&_p]:text-lg [&_p]:leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: generatedPost.content,
            }}
          />
        </article>
      )}
    </div>
  );
}
