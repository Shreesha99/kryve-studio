'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { sendBulkNewsletter } from '@/lib/newsletter';
import { useToast } from '../ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { collection, getDocs } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const newsletterSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters long.'),
  content: z.string().min(20, 'Content must be at least 20 characters long.'),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit: SubmitHandler<NewsletterFormValues> = async (data) => {
    setIsLoading(true);
    try {
      // Fetch subscribers on the client side
      const querySnapshot = await getDocs(collection(firestore, 'subscribers'));
      const subscribers = querySnapshot.docs.map(doc => doc.id);

      if (subscribers.length === 0) {
        toast({
          variant: 'default',
          title: 'No one to send to',
          description: 'There are no subscribers on your mailing list.',
        });
        setIsLoading(false);
        return;
      }
      
      // Pass the subscriber list to the server action
      const result = await sendBulkNewsletter(data, subscribers);
      if (result.success) {
        toast({
          variant: 'success',
          title: 'Newsletter Sent!',
          description: result.message,
        });
        form.reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sending Failed',
        description:
          error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Newsletter</CardTitle>
        <CardDescription>
          Write and send an email to all your subscribers. The email will be
          sent using BCC to protect user privacy.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...form.register('subject')}
              placeholder="e.g., Our Latest Studio Updates"
              disabled={isLoading}
            />
            {form.formState.errors.subject && (
              <p className="text-sm text-destructive">
                {form.formState.errors.subject.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (HTML is supported)</Label>
            <Textarea
              id="content"
              {...form.register('content')}
              rows={12}
              placeholder="<h1>Hello!</h1><p>Here is our weekly update...</p>"
              disabled={isLoading}
            />
            {form.formState.errors.content && (
              <p className="text-sm text-destructive">
                {form.formState.errors.content.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send to All Subscribers
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
