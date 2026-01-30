import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.the-elysium-project.in';

  // Blog posts are now fetched dynamically, so they cannot be included in the
  // build-time sitemap. You could generate this dynamically on the server
  // if you have a large number of posts.
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
  ];
}
