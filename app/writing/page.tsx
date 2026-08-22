'use client';

import Masthead from '@/components/Masthead';
import { LedgerSection, LedgerRow } from '@/components/Ledger';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { articles } from '@/data/articles';
import { formatDateLong } from '@/utils/date';

export default function WritingPage() {
  return (
    <div className="bg-main min-h-screen">
      <main className="page-enter mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20">
        <Masthead />

        <LedgerSection label="All Writing">
          {articles.map((article) => (
            <LedgerRow
              key={article.id}
              href={`/blog/${article.slug}`}
              gutter={article.date.slice(0, 4)}
              title={article.title}
              description={article.excerpt}
              meta={
                article.readTime
                  ? `${formatDateLong(article.date)} · ${article.readTime} min read`
                  : formatDateLong(article.date)
              }
            />
          ))}
        </LedgerSection>

        <Footer />
      </main>

      <ViewModeToggle />
    </div>
  );
}
