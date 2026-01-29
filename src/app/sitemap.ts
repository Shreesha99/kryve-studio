import { MetadataRoute } from 'next';
import { posts } from '@/lib/blog-posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.the-elysium-project.in';

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticPages = [
    '/',
    '/blog',
    '/legal/terms-and-conditions',
    '/legal/privacy-policy',
    '/legal/disclaimer',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1.0 : (route === '/blog' ? 0.8 : 0.5),
  }));

  return [
    ...staticPages,
    ...postUrls,
  ];
}
