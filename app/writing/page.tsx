'use client';

import { useState } from 'react';
import Masthead from '@/components/Masthead';
import { LedgerSection, LedgerRow } from '@/components/Ledger';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { articles, isArchived, type Article } from '@/data/articles';
import { formatDateLong } from '@/utils/date';

type Tab = 'writing' | 'archive';

const articleMeta = (article: Article) =>
  article.readTime
    ? `${formatDateLong(article.date)} · ${article.readTime} min read`
    : formatDateLong(article.date);

export default function WritingPage() {
  const [tab, setTab] = useState<Tab>('writing');

  const current = articles.filter((article) =>
    tab === 'archive' ? isArchived(article) : !isArchived(article)
  );

  const tabClass = (value: Tab) =>
    `transition-colors duration-150 ${
      tab === value
        ? 'text-[var(--ink)]'
        : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
    }`;

  const heading = (
    <span className="flex items-center gap-2">
      <button type="button" onClick={() => setTab('writing')} className={tabClass('writing')}>
        All Writing
      </button>
      <span aria-hidden="true" className="text-[var(--ink-3)]">
        /
      </span>
      <button type="button" onClick={() => setTab('archive')} className={tabClass('archive')}>
        Archive
      </button>
    </span>
  );

  return (
    <div className="bg-main min-h-screen">
      <main className="page-enter mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20">
        <Masthead />

        <LedgerSection label={heading}>
          {current.map((article) => (
            <LedgerRow
              key={article.id}
              href={`/blog/${article.slug}`}
              gutter={tab === 'archive' ? article.date.slice(0, 4) : undefined}
              title={article.title}
              description={article.excerpt}
              meta={articleMeta(article)}
            />
          ))}
        </LedgerSection>

        <Footer />
      </main>

      <ViewModeToggle />
    </div>
  );
}
