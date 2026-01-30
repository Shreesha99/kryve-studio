'use client';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Post } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Image from 'next/image';

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
  imageUrl: z.string().url('Must be a valid URL or a Data URL'),
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
  const [imagePreview, setImagePreview] = useState<string | null>(
    post?.imageUrl || 'https://picsum.photos/seed/default/1200/800'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
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

  const watchedImageUrl = watch('imageUrl');
  useEffect(() => {
    if (watchedImageUrl) {
      setImagePreview(watchedImageUrl);
    }
  }, [watchedImageUrl]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('imageUrl', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };

  const watchedTitle = watch('title');
  useEffect(() => {
    if (!post?.id && watchedTitle) {
      const slug = watchedTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [watchedTitle, setValue, post?.id]);

  const handleFormSubmit: SubmitHandler<FormValues> = data => {
    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 overflow-y-auto max-h-[60vh] p-1"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register('title')} />
          {errors.title && (
            <p className="mt-1 text-sm text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register('slug')} />
          {errors.slug && (
            <p className="mt-1 text-sm text-destructive">
              {errors.slug.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input id="author" {...register('author')} />
        {errors.author && (
          <p className="mt-1 text-sm text-destructive">
            {errors.author.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Image</Label>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="relative mt-4">
            <Label htmlFor="imageUrl" className="sr-only">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              {...register('imageUrl')}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-sm text-destructive">
                {errors.imageUrl.message}
              </p>
            )}
          </TabsContent>
          <TabsContent value="upload" className="relative mt-4">
            <Label htmlFor="imageUpload" className="sr-only">
              Upload Image File
            </Label>
            <Input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="file:text-foreground"
            />
          </TabsContent>
        </Tabs>
        {imagePreview && imagePreview.length > 0 && (
          <div className="mt-4 overflow-hidden rounded-md border">
            <div className="relative aspect-video w-full">
              <Image
                src={imagePreview}
                alt="Image preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="pt-2">
          <Label htmlFor="imageHint">Image Hint (for AI)</Label>
          <Input
            id="imageHint"
            {...register('imageHint')}
            placeholder="e.g. abstract tech"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register('excerpt')} rows={3} />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-destructive">
            {errors.excerpt.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="content">Content (HTML)</Label>
        <Textarea
          id="content"
          {...register('content')}
          rows={10}
          placeholder="Enter content as HTML paragraphs, e.g. <p>Your text here.</p>"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-destructive">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4 border-t pt-4">
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
  );
}
