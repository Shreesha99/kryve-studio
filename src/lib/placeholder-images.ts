import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  title?: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const Projects: ImagePlaceholder[] = data.projects;

export const HeroImage: ImagePlaceholder = data.hero;
