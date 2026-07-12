'use client';
import { useMemo } from 'react';

export default function FoamLayer({ count = 16 }: { count?: number }) {
  const bubbles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      s: 6 + Math.random() * 26,
      l: Math.random() * 100,
      dx: Math.random() * 120 - 60,
      dur: 9 + Math.random() * 10,
      del: Math.random() * 12,
      key: i,
    })), [count]);
  return (
    <div className="foam" aria-hidden="true">
      {bubbles.map(b => (
        <i key={b.key} style={{
          width: b.s, height: b.s, left: `${b.l}%`,
          ['--dx' as any]: `${b.dx}px`,
          animationDuration: `${b.dur}s`, animationDelay: `${b.del}s`,
        }} />
      ))}
    </div>
  );
}
