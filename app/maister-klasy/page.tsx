import type { Metadata } from 'next';
import { getMasterclassPhotos } from '@/lib/content';
import MasterClassesClient from './MasterClassesClient';

/* Серверная обёртка: фото мастер-классов берутся из админки (Supabase),
   а вся интерактивность — в MasterClassesClient. */

export const metadata: Metadata = {
  title: 'Майстер-класи для дітей і дорослих — TVORCHI, Кременчук',
  description:
    'Разові творчі майстер-класи: ліплення, розпис пряників, холст, неонове малювання, бентоторт та інші. ' +
    'Ціна за учасника, усі матеріали включено. Раківка та Молодіжний.',
};

export const revalidate = 60;

export default async function MasterClassesPage() {
  const photos = await getMasterclassPhotos();
  return <MasterClassesClient photos={photos} />;
}
