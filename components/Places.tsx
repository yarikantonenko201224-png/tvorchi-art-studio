import { STUDIO } from '@/lib/data';

/* Две локации с небольшой картой. Карта Google встраивается без ключа;
   грузится лениво, когда блок доходит до экрана. */
export function mapQuery(address: string) {
  return encodeURIComponent(`Кременчук, ${address}`);
}

export default function Places() {
  return (
    <div className="lp-places">
      {STUDIO.locations.map((l, i) => (
        <div key={l.slug} className="lp-place" data-reveal style={{ ['--rv-delay' as string]: `${i * 0.12}s` }}>
          <div className="lp-place-map">
            <iframe
              title={`Карта: ${l.title}, ${l.address}`}
              src={`https://maps.google.com/maps?q=${mapQuery(l.address)}&z=16&hl=uk&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <span className="lp-place-pin" aria-hidden="true">{l.title}</span>
          </div>
          <div className="lp-place-body">
            <h3>{l.title}</h3>
            <p className="lp-place-addr">{l.address}</p>
            <p>{l.note}</p>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery(l.address)}`} target="_blank" rel="noopener">
              Прокласти маршрут
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
