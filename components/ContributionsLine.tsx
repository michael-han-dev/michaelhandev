'use client';

import { useEffect, useState } from 'react';

export default function ContributionsLine() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/github-contributions')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data) => {
        if (!cancelled && typeof data?.totalContributions === 'number') {
          setTotal(data.totalContributions);
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
