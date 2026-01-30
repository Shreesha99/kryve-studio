'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';

import {
  generateVisionBoard,
  type GenerateVisionBoardOutput,
} from '@/ai/flows/generate-vision-board';
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
import { AnimateOnScroll } from '../common/animate-on-scroll';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'Topic must be at least 3 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

function VisionBoardResult({ result }: { result: GenerateVisionBoardOutput }) {
  return (
    <AnimateOnScroll
      key={result.imageUrl}
      className="mx-auto mt-12 max-w-none rounded-xl border bg-card/50 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg">
          <Image
            src={result.imageUrl}
            alt="AI generated vision board image"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div>
            <h3 className="font-headline text-2xl font-semibold">Mood</h3>
            <p className="mt-2 text-muted-foreground">{result.mood}</p>
          </div>
          <div className="mt-6">
            <h3 className="font-headline text-2xl font-semibold">Color Palette</h3>
            <div className="mt-4 flex flex-wrap gap-4">
              {result.colors.map(color => (
                <div key={color.hex} className="text-center">
                  <div
                    className="h-16 w-16 rounded-full border-2 border-border shadow-inner"
                    style={{ backgroundColor: color.hex }}
                  />
                  <p className="mt-2 text-sm font-medium">{color.name}</p>
                  <p className="text-xs text-muted-foreground">{color.hex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}

export function VisionBoardGenerator() {
  const [result, setResult] = useState<GenerateVisionBoardOutput | null>(
    null
  );
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
    setResult(null);
    try {
      const visionBoard = await generateVisionBoard({ topic: values.topic });
      setResult(visionBoard);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : 'Please try again.';
      setError(`Failed to generate vision board. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 pb-16 md:px-6 md:pb-24">
      <div className="space-y-4 text-center">
        <h2 className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl">
          AI Vision Board
        </h2>
        <p className="text-muted-foreground md:text-xl">
          Stuck for inspiration? Describe a concept, and let our AI generate a
          mood, color palette, and image to kickstart your creative process.
          <br />
          <span className="mt-2 block text-sm">Note: Image generation is an advanced feature and may require a billed Google AI account.</span>
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-2xl">
        <CardHeader>
          <CardTitle>Generate a Vision Board</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concept / Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'A cozy, minimalist coffee shop in Tokyo'"
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
                    <span className="material-symbols-outlined mr-2 animate-spin">
                      auto_awesome
                    </span>
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
        <p className="mt-8 text-center text-destructive">{error}</p>
      )}

      {result && <VisionBoardResult result={result} />}
    </div>
  );
}
