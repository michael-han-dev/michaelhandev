'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV: Array<[string, string]> = [
  ['/writing', 'writing'],
  ['/projects', 'projects'],
  ['/experience', 'experience'],
];

export default function Masthead() {
  const pathname = usePathname();

  return (
    <header className="flex items-baseline justify-between gap-6">
      <Link
        href="/"
        className="font-display text-lg text-[var(--ink)]"
      >
        Michael Han
      </Link>
      <nav className="flex gap-5 font-mono text-[13px]">
        {NAV.map(([href, label]) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className={
                active
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--ink-3)] transition-colors duration-150 hover:text-[var(--ink-2)]'
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
