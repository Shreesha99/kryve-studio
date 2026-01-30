'use server';

/**
 * @fileOverview AI Vision Board generation flow.
 *
 * - generateVisionBoard - A function that generates a vision board with a mood, color palette, and image.
 * - GenerateVisionBoardInput - The input type for the function.
 * - GenerateVisionBoardOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVisionBoardInputSchema = z.object({
  topic: z.string().describe('The topic or concept for the vision board.'),
});
export type GenerateVisionBoardInput = z.infer<
  typeof GenerateVisionBoardInputSchema
>;

const ColorSchema = z.object({
  hex: z.string().describe('The hex code of the color, e.g., #FFFFFF.'),
  name: z.string().describe('A descriptive name for the color, e.g., "Snow White".'),
});

const TextOutputSchema = z.object({
  mood: z
    .string()
    .describe(
      'A short, evocative paragraph describing the mood and aesthetic of the topic.'
    ),
  colors: z
    .array(ColorSchema)
    .length(5)
    .describe('An array of 5 colors that represent the topic.'),
});

const GenerateVisionBoardOutputSchema = z.object({
  mood: z.string(),
  colors: z.array(ColorSchema),
  imageUrl: z
    .string()
    .describe('A data URI of the generated image.'),
});
export type GenerateVisionBoardOutput = z.infer<
  typeof GenerateVisionBoardOutputSchema
>;

// This is the function the client will call.
export async function generateVisionBoard(
  input: GenerateVisionBoardInput
): Promise<GenerateVisionBoardOutput> {
  return generateVisionBoardFlow(input);
}

const textPrompt = ai.definePrompt({
  name: 'generateVisionBoardTextPrompt',
  input: {schema: GenerateVisionBoardInputSchema},
  output: {schema: TextOutputSchema},
  system: `You are a world-class art director and brand strategist.
Your task is to generate a mood and a 5-color palette for a given topic.
The mood should be a single, evocative paragraph.
The color names should be creative and descriptive.`,
  prompt: `Generate a vision board concept for the following topic: {{{topic}}}.`,
});

const generateVisionBoardFlow = ai.defineFlow(
  {
    name: 'generateVisionBoardFlow',
    inputSchema: GenerateVisionBoardInputSchema,
    outputSchema: GenerateVisionBoardOutputSchema,
  },
  async input => {
    // Generate text and colors first
    const {output: textOutput} = await textPrompt(input);

    if (!textOutput) {
      throw new Error('Failed to generate text content for the vision board.');
    }

    // Then generate the image
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `A high-resolution, artistic, and visually stunning image representing the concept: "${input.topic}". Mood: ${textOutput.mood}. Photographic style.`,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate an image for the vision board.');
    }

    return {
      mood: textOutput.mood,
      colors: textOutput.colors,
      imageUrl: media.url,
    };
  }
);
