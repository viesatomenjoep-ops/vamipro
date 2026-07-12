export default function Marquee({ items }: { items: string[] }) {
  const row = (key: string, hidden = false) => (
    <div key={key} aria-hidden={hidden} className="marquee-item">
      {items.map((t, i) => (
        <span key={i} className="inline-flex items-center gap-[3.2rem]">
          {t}
          <span className="marquee-dot" />
        </span>
      ))}
    </div>
  );
  return (
    <div className="marquee border-y hairline bg-panel py-5 md:py-6" role="presentation">
      <div className="marquee-track">
        {row('a')}
        {row('b', true)}
      </div>
    </div>
  );
}
