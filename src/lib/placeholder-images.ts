import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  title?: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export type Founder = {
    id: string;
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
    imageHint: string;
}

export const Projects: ImagePlaceholder[] = data.projects;

export const AboutImage: ImagePlaceholder = data.about;

export const Founders: Founder[] = data.founders;
