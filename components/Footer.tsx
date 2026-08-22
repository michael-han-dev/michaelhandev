'use client';

import ContributionsLine from '@/components/ContributionsLine';

const SOCIALS = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/michael-y-han/' },
  { label: 'github', href: 'https://github.com/michael-han-dev' },
  { label: 'x', href: 'https://x.com/michaelyhan_' },
];

export default function Footer() {
  return (
    <footer className="hairline-t mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-6">
      <ContributionsLine />
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[13px]">
        {SOCIALS.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--ink-3)] transition-colors duration-150 hover:text-[var(--accent)]"
          >
            {social.label}
          </a>
        ))}
        <a
          href="https://github.com/michael-han-dev/michaelhandev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--ink-3)] transition-colors duration-150 hover:text-[var(--accent)]"
        >
          source
        </a>
      </nav>
    </footer>
  );
}
