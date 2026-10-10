import { permanentRedirect } from 'next/navigation';

/* /i — короткая ссылка из bio в Instagram. Раньше здесь была отдельная
   мини-страница; новая главная сама удобна с телефона, поэтому ведём туда.
   Ссылка в bio продолжает работать. */
export default function InstagramEntry() {
  permanentRedirect('/');
}
