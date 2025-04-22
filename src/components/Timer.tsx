'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  startTime: string;
}

export default function Timer({ startTime }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();
    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 10);
    return () => clearInterval(interval);
  }, [startTime]);

  const format = (ms: number) => {
    const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
    const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    const msRemaining = String(ms % 1000).padStart(3, '0');
    return `${h}:${m}:${s}.${msRemaining}`;
  };

  return (
    <div className="casio-watch">
      {format(elapsed)}
    </div>
  );
}
