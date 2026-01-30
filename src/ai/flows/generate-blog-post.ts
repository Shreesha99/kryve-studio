'use server';

/**
 * @fileOverview Blog post generation flow.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 * - provideBlogPostFeedback - A function to provide feedback on a generated post.
 * - BlogPostFeedbackInput - The input type for the feedback function.
 */

import {ai} from '@/ai/genkit';
import {updateTrace} from 'genkit';
import {z} from 'zod';

const GenerateBlogPostInputSchema = z.object({
  topic: z.string().describe('The topic of the blog post.'),
});
export type GenerateBlogPostInput = z.infer<typeof GenerateBlogPostInputSchema>;

const GenerateBlogPostOutputSchema = z.object({
  title: z.string().describe('The title of the blog post.'),
  content: z
    .string()
    .describe(
      'The content of the blog post, formatted as a single string of HTML paragraphs. For example: <p>First paragraph.</p><p>Second paragraph.</p>'
    ),
  traceId: z.string().describe('The trace ID for providing feedback.'),
});
export type GenerateBlogPostOutput = z.infer<
  typeof GenerateBlogPostOutputSchema
>;

export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {
    schema: z.object({
      title: GenerateBlogPostOutputSchema.shape.title,
      content: GenerateBlogPostOutputSchema.shape.content,
    }),
  },
  system: `You are an expert blog post writer for a creative digital agency called The Elysium Project.
Your tone should be professional, insightful, and slightly informal.
You write content that is engaging and well-structured.`,
  prompt: `Generate a blog post about the following topic: {{{topic}}}.`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output, traceId} = await prompt(input);
    return {
      ...output!,
      traceId: traceId,
    };
  }
);

// New feedback functionality
const BlogPostFeedbackInputSchema = z.object({
  traceId: z.string(),
  rating: z.enum(['liked', 'disliked']),
});
export type BlogPostFeedbackInput = z.infer<typeof BlogPostFeedbackInputSchema>;

export async function provideBlogPostFeedback(
  input: BlogPostFeedbackInput
): Promise<void> {
  return provideBlogPostFeedbackFlow(input);
}

const provideBlogPostFeedbackFlow = ai.defineFlow(
  {
    name: 'provideBlogPostFeedbackFlow',
    inputSchema: BlogPostFeedbackInputSchema,
    outputSchema: z.void(),
  },
  async ({traceId, rating}) => {
    await updateTrace(traceId, {
      userFeedback: {
        rating: rating === 'liked' ? 1 : 0,
        comment: `User ${rating} this blog post generation.`,
      },
    });
  }
);
