import Link from 'next/link';

/* Заглушка для страниц, которые ещё собираются.
   Нужна, чтобы ссылки из хаба не вели в 404 во время разработки. */
export default function Soon({ title, note }: { title: string; note: string }) {
  return (
    <>
      <div className="page">
        <div className="topbar">
          <Link className="icon-btn" href="/i" aria-label="Назад">←</Link>
        </div>

        <h1 className="t-h1" style={{ marginTop: 18 }}>{title}</h1>
        <p className="t-lead">{note}</p>

        <div className="note" style={{ marginTop: 24 }}>
          Сторінка в розробці. Поки що всі питання — за телефоном або в Direct.
        </div>
      </div>

      <div className="bar">
        <Link className="btn btn--wide" href="/i" style={{ display: 'grid', placeItems: 'center' }}>
          На головну
        </Link>
      </div>
    </>
  );
}
