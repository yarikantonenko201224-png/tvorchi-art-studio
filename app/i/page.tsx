import Hub from '@/components/Hub';

export const metadata = {
  title: 'TVORCHI ART STUDIO — заняття, свята, майстер-класи',
  description: 'Оберіть, що вас цікавить: запис на заняття, день народження, розклад або майстер-клас.',
};

/* /i — короткая ссылка для bio в Instagram.
   Под конкретные посты потом добавятся /i/dr, /i/mk, /i/rozklad. */
export default function InstagramHubPage() {
  return <Hub />;
}
