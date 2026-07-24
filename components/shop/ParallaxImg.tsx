/** Voorheen scroll-parallax; effect verwijderd — rendert het kind nu statisch. */
export default function ParallaxImg({ children, className = '' }: {
  children: React.ReactNode; strength?: number; className?: string;
}) {
  return <div className={className}>{children}</div>;
}
