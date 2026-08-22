'use client';

import { useEffect, useState } from 'react';

const CACHE_KEY = 'gh-contributions-total';

let lastKnownTotal: number | null = null;

function readSessionCache(): number | null {
  try {
    const stored = sessionStorage.getItem(CACHE_KEY);
    const parsed = stored === null ? NaN : Number(stored);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export default function ContributionsLine() {
  const [total, setTotal] = useState<number | null>(lastKnownTotal);

  useEffect(() => {
    let cancelled = false;

    if (total === null) {
      const cached = readSessionCache();
      if (cached !== null && !cancelled) {
        lastKnownTotal = cached;
        setTotal(cached);
      }
    }

    fetch('/api/github-contributions')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (!cancelled && typeof data?.totalContributions === 'number') {
          lastKnownTotal = data.totalContributions;
          setTotal(data.totalContributions);
          try {
            sessionStorage.setItem(CACHE_KEY, String(data.totalContributions));
          } catch {}
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (total === null) return null;

  return (
    <p className="meta">
      {total.toLocaleString('en-US')} contributions this year
    </p>
  );
}
