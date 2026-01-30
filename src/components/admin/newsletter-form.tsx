'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { sendBulkNewsletter } from '@/lib/newsletter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Send } from 'lucide-react';

type Subscriber = {
  id: string;
  email: string;
};

const newsletterSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  content: z.string().min(20, 'Content must be at least 20 characters long.'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);
  const firestore = useFirestore();

  const subscribersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'subscribers'));
  }, [firestore]);

  const { data: subscribers, isLoading: isLoadingSubscribers } = useCollection<Subscriber>(subscribersQuery);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit: SubmitHandler<NewsletterFormValues> = async (data) => {
    if (!subscribers || subscribers.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Subscribers',
        description: 'There are no subscribers in your mailing list to send to.',
      });
      return;
    }

    setIsSending(true);
    const emailList = subscribers.map(s => s.email);
    
    const result = await sendBulkNewsletter({
      ...data,
      subscribers: emailList,
    });

    if (result.success) {
      toast({
        variant: 'success',
        title: 'Newsletter Sent!',
        description: result.message,
      });
      reset();
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: result.message,
      });
    }

    setIsSending(false);
  };

  const isButtonDisabled = isSending || isLoadingSubscribers;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-medium text-lg text-card-foreground">Subscribers</h3>
        <p className="text-sm text-muted-foreground">
          {isLoadingSubscribers
            ? 'Loading subscriber count...'
            : `${subscribers?.length || 0} active subscribers.`}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" {...register('subject')} disabled={isSending} />
          {errors.subject && (
            <p className="mt-1 text-sm text-destructive">
              {errors.subject.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="content">Content (HTML)</Label>
          <Textarea
            id="content"
            rows={12}
            {...register('content')}
            disabled={isSending}
            placeholder="<p>Write your newsletter content here using HTML.</p>"
          />
          {errors.content && (
            <p className="mt-1 text-sm text-destructive">
              {errors.content.message}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isButtonDisabled}>
            {isSending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {isSending ? 'Sending...' : `Send to ${subscribers?.length || 0} subscribers`}
          </Button>
        </div>
      </form>
    </div>
  );
}
