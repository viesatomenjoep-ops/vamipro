import { MetadataRoute } from 'next';
import { SITE_URL as baseUrl } from '@/lib/site-url';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/', '/winkelmandje'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
