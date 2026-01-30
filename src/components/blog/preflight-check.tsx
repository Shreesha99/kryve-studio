'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { gsap } from 'gsap';

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
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Search, Zap, ShieldCheck } from 'lucide-react';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

const analysisSteps = [
  { text: 'Analyzing SEO readiness...', icon: Search },
  { text: 'Checking performance bottlenecks...', icon: Zap },
  { text: 'Scanning accessibility standards...', icon: ShieldCheck },
  { text: 'Verifying best practices...', icon: CheckCircle2 },
];

export function PreflightCheck() {
  const [analysisStatus, setAnalysisStatus] = useState<
    'idle' | 'running' | 'complete'
  >('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const analysisBoxRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = () => {
    setAnalysisStatus('running');
    setCurrentStep(0);
    setProgress(0);
  };
  
  useEffect(() => {
    if (analysisStatus !== 'running') {
      return;
    }

    tl.current = gsap.timeline({
      onComplete: () => {
        setAnalysisStatus('complete');
      },
    });

    const stepDuration = 1.5; // seconds per step

    analysisSteps.forEach((_, index) => {
      tl.current!.to(
        {},
        {
          duration: stepDuration,
          onStart: () => {
            setCurrentStep(index);
          },
        }
      );
    });
    
    // Animate progress bar
    const progressProxy = { value: 0 };
    const tween = gsap.to(
      progressProxy,
      {
        value: 100,
        duration: stepDuration * analysisSteps.length,
        ease: 'none',
        onUpdate: () => {
          setProgress(progressProxy.value);
        },
      }
    );
    
    return () => {
      tl.current?.kill();
      tween.kill();
    }

  }, [analysisStatus]);


  const resetAnalysis = () => {
    setAnalysisStatus('idle');
    setCurrentStep(0);
    setProgress(0);
    form.reset();
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 pb-16 md:px-6 md:pb-24">
      <div className="space-y-4 text-center">
        <h2 className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl">
          Website Pre-flight Check
        </h2>
        <p className="text-muted-foreground md:text-xl">
          Curious about your site's readiness? Our simulated AI analyzes key metrics to give you a snapshot of its health.
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-2xl">
        <CardHeader>
          <CardTitle>Run Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {analysisStatus === 'idle' && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                        <Input
                            placeholder="https://example.com"
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                    Analyze Website
                </Button>
                </form>
            </Form>
          )}

          {(analysisStatus === 'running' || analysisStatus === 'complete') && (
            <div ref={analysisBoxRef} className="space-y-6">
              <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <div className="flex h-8 items-center gap-4 text-lg font-medium">
                      {analysisStatus === 'running' && (
                          <>
                            {currentStep === 0 && <Search className="h-6 w-6 animate-spin" />}
                            {currentStep === 1 && <Zap className="h-6 w-6 animate-spin" />}
                            {currentStep === 2 && <ShieldCheck className="h-6 w-6 animate-spin" />}
                            {currentStep === 3 && <CheckCircle2 className="h-6 w-6 animate-spin" />}
                            <p>{analysisSteps[currentStep].text}</p>
                          </>
                      )}
                      {analysisStatus === 'complete' && (
                           <div className="flex w-full flex-col items-center gap-4 text-center">
                              <CheckCircle2 className="h-12 w-12 text-green-500" />
                              <p className="text-2xl font-semibold">Analysis Complete: All Systems Go!</p>
                           </div>
                      )}
                  </div>
              </div>
               {analysisStatus === 'complete' && (
                  <Button onClick={resetAnalysis} variant="outline" className="w-full">
                      Run Another Analysis
                  </Button>
                )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
