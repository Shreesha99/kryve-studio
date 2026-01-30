'use client';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Post } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z
    .string()
    .min(5, 'Slug must be at least 5 characters')
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens'
    ),
  author: z.string().min(3, 'Author name is required'),
  excerpt: z
    .string()
    .min(10, 'Excerpt is required')
    .max(300, 'Excerpt cannot be more than 300 characters'),
  content: z.string().min(20, 'Content is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: Post | null;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function PostForm({
  post,
  onSubmit,
  onCancel,
  isSubmitting,
}: PostFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      author: post?.author || 'The Elysium Project',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      imageUrl: post?.imageUrl || 'https://picsum.photos/seed/default/1200/800',
      imageHint: post?.imageHint || 'abstract',
    },
  });

  // Auto-generate slug from title for new posts
  const watchedTitle = form.watch('title');
  useEffect(() => {
    if (!post?.id && watchedTitle) {
      // Only for new posts
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  }, [watchedTitle, form, post?.id]);

  const handleFormSubmit: SubmitHandler<FormValues> = data => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="flex h-full flex-col"
      >
        <ScrollArea className="flex-auto">
          <div className="space-y-6 px-1 py-1 pr-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image Hint (for AI)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. abstract tech" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (HTML)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      placeholder="Enter content as HTML paragraphs, e.g. <p>Your text here.</p>"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="flex flex-shrink-0 justify-end gap-4 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Save Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
