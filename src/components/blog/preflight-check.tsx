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
import { CheckCircle2, Search, Zap, ShieldCheck, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimateOnScroll } from '../common/animate-on-scroll';

const formSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

type FormValues = z.infer<typeof formSchema>;

const analysisSteps = [
  { text: 'Analyzing SEO readiness', icon: Search },
  { text: 'Checking performance bottlenecks', icon: Zap },
  { text: 'Scanning accessibility standards', icon: ShieldCheck },
  { text: 'Verifying best practices', icon: CheckCircle2 },
];

export function PreflightCheck() {
  const [analysisStatus, setAnalysisStatus] = useState<
    'idle' | 'running' | 'complete'
  >('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const analysisBoxRef = useRef<HTMLDivElement>(null);

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

    const stepDuration = 1.5; // seconds per step
    const totalDuration = stepDuration * analysisSteps.length;
    
    // Animate progress bar
    const progressProxy = { value: 0 };
    const progressTween = gsap.to(
      progressProxy,
      {
        value: 100,
        duration: totalDuration,
        ease: 'none',
        onUpdate: () => {
          setProgress(progressProxy.value);
        },
      }
    );

    // Animate steps
    const stepsTl = gsap.timeline({
        onComplete: () => {
          setAnalysisStatus('complete');
        },
    });

    analysisSteps.forEach((_, index) => {
        stepsTl.to({}, { 
            duration: stepDuration, 
            onStart: () => setCurrentStep(index) 
        });
    });
    
    return () => {
      progressTween.kill();
      stepsTl.kill();
    }

  }, [analysisStatus]);


  const resetAnalysis = () => {
    setAnalysisStatus('idle');
    setCurrentStep(0);
    setProgress(0);
    form.reset();
  };

  return (
    <AnimateOnScroll>
        <div className="container mx-auto max-w-4xl px-4 pb-16 md:px-6 md:pb-24">
            <div className="space-y-4 text-center">
                <h2 className="font-headline text-4xl font-semibold tracking-tighter sm:text-5xl">
                Website Pre-flight Check
                </h2>
                <p className="text-muted-foreground md:text-xl">
                You are correct! This is a simulated analysis. It's designed to showcase our UI/UX and animation skills—it will always succeed because, unlike unreliable external APIs, our frontend work is built to be flawless.
                </p>
            </div>

            <Card className="mx-auto mt-12 max-w-2xl overflow-hidden">
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
                    <div>
                        <Progress value={progress} className="w-full" />
                        <ul className="mt-6 space-y-4">
                            {analysisSteps.map((step, index) => {
                                const isCompleted = analysisStatus === 'complete' || (analysisStatus === 'running' && index < currentStep);
                                const isActive = analysisStatus === 'running' && index === currentStep;
                                const isPending = analysisStatus === 'running' && index > currentStep;

                                const StepIcon = step.icon;

                                return (
                                    <li key={step.text} className={cn("flex items-center gap-4 transition-opacity duration-300",
                                        isPending ? 'opacity-40' : 'opacity-100'
                                    )}>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                                           <StepIcon className="h-5 w-5 text-secondary-foreground" />
                                        </div>
                                        <p className="flex-grow font-medium text-foreground">{step.text}</p>
                                        <div className="h-6 w-6">
                                            {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                                            {isActive && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    {analysisStatus === 'complete' && (
                        <AnimateOnScroll className="space-y-4 text-center">
                            <div className="flex w-full flex-col items-center gap-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                                <p className="text-2xl font-semibold">Analysis Complete: All Systems Go!</p>
                            </div>
                            <Button onClick={resetAnalysis} variant="outline" className="w-full">
                                Run Another Analysis
                            </Button>
                        </AnimateOnScroll>
                    )}
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
    </AnimateOnScroll>
  );
}
