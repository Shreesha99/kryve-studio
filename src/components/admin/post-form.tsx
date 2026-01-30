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
import { addDoc, collection, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
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
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
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
      const postData = {
        ...data,
        date: post?.id ? new Date(post.date) : serverTimestamp(),
      };

      if (post?.id) {
        // Editing existing post
        const postRef = doc(firestore, 'posts', post.id);
        await setDoc(postRef, postData, { merge: true });
      } else {
        // Creating new post
        const postsCollection = collection(firestore, 'posts');
        await addDoc(postsCollection, postData);
      }
      onSuccess();
    } catch (e: any) {
      console.error(e);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4">
      {Object.entries(formSchema.shape).map(([key, _]) => {
          const field = key as keyof FormValues;
          const isTextarea = field === 'excerpt' || field === 'content';
          return (
            <div key={field} className="space-y-1">
              <Label htmlFor={field} className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</Label>
              {isTextarea ? (
                  <Textarea id={field} {...register(field)} rows={field === 'content' ? 8 : 3} />
              ) : (
                  <Input id={field} {...register(field)} />
              )}
              {errors[field] && <p className="text-sm text-destructive">{errors[field]?.message}</p>}
            </div>
          )
        })}

      {error && <p className="text-sm text-destructive">{error}</p>}
      
      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Post'}
        </Button>
      </div>
    </form>
  );
}
