'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Post } from '@/lib/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(5, 'Slug must be at least 5 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  author: z.string().min(3, 'Author name is required'),
  excerpt: z.string().min(10, 'Excerpt is required'),
  content: z.string().min(20, 'Content is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  imageHint: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: Post | null;
  onSuccess: () => void;
}

export function PostForm({ post, onSuccess }: PostFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      author: post?.author || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      imageUrl: post?.imageUrl || 'https://picsum.photos/seed/default/1200/800',
      imageHint: post?.imageHint || 'abstract',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { firestore } = initializeFirebase();
      
      if (post?.id) {
        // Editing existing post: merge new data with existing document
        const postRef = doc(firestore, 'posts', post.id);
        await setDoc(postRef, data, { merge: true });
      } else {
        // Creating new post: add form data and creation date
        const postsCollection = collection(firestore, 'posts');
        await addDoc(postsCollection, {
          ...data,
          date: serverTimestamp(),
        });
      }
      onSuccess();
    } catch (e: any) {
      console.error("Error saving post:", e);
      setError(`An error occurred: ${e.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-sm text-destructive">{errors.title?.message}</p>}
        </div>
        <div className="space-y-1">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && <p className="text-sm text-destructive">{errors.slug?.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="author">Author</Label>
        <Input id="author" {...register("author")} />
        {errors.author && <p className="text-sm text-destructive">{errors.author?.message}</p>}
      </div>

       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-1">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" {...register("imageUrl")} />
            {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl?.message}</p>}
        </div>
        <div className="space-y-1">
            <Label htmlFor="imageHint">Image Hint</Label>
            <Input id="imageHint" {...register("imageHint")} />
            {errors.imageHint && <p className="text-sm text-destructive">{errors.imageHint?.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" {...register("excerpt")} rows={3} />
        {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt?.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="content">Content (HTML)</Label>
        <Textarea id="content" {...register("content")} rows={8} placeholder="Enter content as HTML paragraphs, e.g. <p>Your text here.</p>" />
        {errors.content && <p className="text-sm text-destructive">{errors.content?.message}</p>}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      <div className="flex justify-end pt-4 sticky bottom-0 bg-background/90 pb-2">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Post'}
        </Button>
      </div>
    </form>
  );
}
