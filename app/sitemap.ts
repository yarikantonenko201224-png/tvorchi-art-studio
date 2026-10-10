import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';
import { AUTUMN_CAMP, AUTUMN_TRIP, PARTIES } from '@/lib/events';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['', 1, 'weekly'],
    ['/rozklad', 0.9, 'monthly'],
    ['/zapys', 0.9, 'monthly'],
    ['/maister-klasy', 0.8, 'monthly'],
    ['/den-narodzhennya', 0.8, 'monthly'],
    ['/anonsy', 0.8, 'daily'],
    ['/sertyfikaty', 0.7, 'monthly'],
    ['/pidbir', 0.6, 'monthly'],
    ['/faq', 0.6, 'monthly'],
    [`/anonsy/${AUTUMN_CAMP.slug}`, 0.7, 'weekly'],
    [`/anonsy/${AUTUMN_TRIP.slug}`, 0.6, 'weekly'],
    [`/anonsy/${PARTIES.slug}`, 0.7, 'weekly'],
    ['/polityka-konfidentsiinosti', 0.2, 'yearly'],
  ];
  return pages.map(([path, priority, changeFrequency]) => ({
    url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority,
  }));
}
