import Link from 'next/link';
import Capy from '@/components/Capy';

export const metadata = { title: 'Сторінку не знайдено — TVORCHI' };

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: 48, paddingBottom: 48 }}>
      <div style={{ display: 'inline-block', transform: 'rotate(-4deg)' }}><Capy size={170} mood="wink" /></div>
      <h1 className="t-h1" style={{ marginTop: 16 }}>Такої сторінки немає</h1>
      <p className="t-lead" style={{ margin: '12px auto 0' }}>
        Можливо, посилання застаріло. Капі пропонує почати з головної або одразу записатися на пробне.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
        <Link className="btn" href="/" style={{ display: 'inline-grid', placeItems: 'center', textDecoration: 'none' }}>На головну</Link>
        <Link className="btn btn--ghost" href="/zapys" style={{ display: 'inline-grid', placeItems: 'center', textDecoration: 'none' }}>Записатися на пробне</Link>
      </div>
    </div>
  );
}
