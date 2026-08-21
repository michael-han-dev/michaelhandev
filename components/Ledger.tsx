import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function LedgerSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-20">
      <h2 className="eyebrow">{label}</h2>
      <div className="mt-2 divide-y divide-[var(--line)]">{children}</div>
    </section>
  );
}

interface LedgerRowProps {
  href?: string;
  gutter?: string;
  title: string;
  description?: string;
  meta?: string;
}

export function LedgerRow({ href, gutter, title, description, meta }: LedgerRowProps) {
  const external = href ? isExternal(href) : false;
  const linkProps = external
    ? { target: '_blank' as const, rel: 'noopener noreferrer' }
    : {};

  const body = (
    <>
      {gutter && <span className="meta mb-1 block sm:mb-0 sm:pt-0.5">{gutter}</span>}
      <span className="block">
        <span className="flex items-baseline justify-between gap-4">
          <span
            className={`font-medium text-[var(--ink)] ${
              href
                ? 'transition-colors duration-150 group-hover:text-[var(--accent)]'
                : ''
            }`}
          >
            {title}
          </span>
          {external && (
            <ArrowUpRight
              size={14}
              className="flex-shrink-0 self-center text-[var(--ink-3)] transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
            />
          )}
        </span>
        {description && (
          <span className="mt-1.5 block text-sm leading-relaxed text-[var(--ink-2)]">
            {description}
          </span>
        )}
        {meta && <span className="meta mt-2 block">{meta}</span>}
      </span>
    </>
  );

  const layoutClass = 'block py-5 sm:grid sm:grid-cols-[7rem_minmax(0,1fr)] sm:gap-x-8';

  if (!href) {
    return <div className={layoutClass}>{body}</div>;
  }

  return (
    <Link href={href} {...linkProps} className={`group ${layoutClass}`}>
      {body}
    </Link>
  );
}
