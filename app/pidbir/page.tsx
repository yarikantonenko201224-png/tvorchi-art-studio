import { Suspense } from 'react';
import Quiz from '@/components/Quiz';

export const metadata = {
  title: 'Підбір заняття — TVORCHI ART STUDIO',
  description:
    'Три питання — і ми порекомендуємо напрями, які підійдуть саме вашій дитині: малювання, робототехніка, англійська, підготовка до школи.',
};

/* useSearchParams требует Suspense-границы, иначе страница
   не соберётся статически. */
export default function QuizPage() {
  return (
    <Suspense fallback={<div className="page" style={{ paddingTop: 80 }}>Завантаження…</div>}>
      <Quiz />
    </Suspense>
  );
}
