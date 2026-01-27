'use server';

/**
 * @fileOverview Blog post generation flow.
 *
 * - generateBlogPost - A function that generates a blog post.
 * - GenerateBlogPostInput - The input type for the generateBlogPost function.
 * - GenerateBlogPostOutput - The return type for the generateBlogPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
});
export type GenerateBlogPostOutput = z.infer<typeof GenerateBlogPostOutputSchema>;

export async function generateBlogPost(
  input: GenerateBlogPostInput
): Promise<GenerateBlogPostOutput> {
  return generateBlogPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogPostPrompt',
  input: {schema: GenerateBlogPostInputSchema},
  output: {schema: GenerateBlogPostOutputSchema},
  system: `You are an expert blog post writer for a creative digital agency called Zenith Studio.
Your tone should be professional, insightful, and slightly informal.
You MUST respond with a valid JSON object that conforms to the following schema:
{
  "title": "The title of the blog post.",
  "content": "The content of the blog post, formatted as a single string of HTML paragraphs. For example: '<p>First paragraph.</p><p>Second paragraph.</p><p>Third paragraph.</p>'"
}
Do not include any other text or markdown formatting like \`\`\`json\`\`\` around your response.`,
  prompt: `Generate a blog post about the following topic: {{{topic}}}.`,
});

const generateBlogPostFlow = ai.defineFlow(
  {
    name: 'generateBlogPostFlow',
    inputSchema: GenerateBlogPostInputSchema,
    outputSchema: GenerateBlogPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
