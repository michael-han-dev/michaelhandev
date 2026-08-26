'use client';

import Masthead from '@/components/Masthead';
import { LedgerSection, LedgerRow } from '@/components/Ledger';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { getRecentArticles } from '@/data/articles';
import { formatDateLong } from '@/utils/date';

export default function Home() {
  const recentArticles = getRecentArticles(4);

  return (
    <div className="bg-main min-h-screen">
      <main className="page-enter mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20">
        <Masthead />

        <section className="mt-16">
          <h1 className="text-lg leading-snug text-[var(--ink)]">
            Software engineer, occasional chilli chef, lifelong baseball guy.
          </h1>
          <p className="mt-6 leading-relaxed text-[var(--ink-2)]">
            Currently spending my time exploring the mountains, backend development, content creation, and prediction markets. I study Mathematics and
            Computer Engineering at{' '}
            <a
              href="https://www.queensu.ca/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-inline"
            >
              Queen&apos;s University.
            </a>{' '}
            Expected to graduate in 2027.
          </p>

          <div className="mt-10">
            <div className="eyebrow">As of late</div>
            <div className="mt-3 space-y-2 font-mono text-[13px] text-[var(--ink-2)]">
              <div className="flex items-center gap-2.5">
                <span className="pulse-dot" />
                <span>
                  Working on the engineering team at{' '}
                  <a
                    href="https://rootly.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[var(--accent)] underline-offset-2 transition-colors hover:text-[var(--accent)]"
                  >
                    Rootly (YC S21)
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="pulse-dot" />
                <span>
                  Worked on the engineering team at{' '}
                  <a
                    href="https://www.questrade.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-[var(--accent)] underline-offset-2 transition-colors hover:text-[var(--accent)]"
                  >
                    Questrade
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="pulse-dot" />
                <span>Climbed Kilimanjaro and hiked Everest Base Camp.</span>
              </div>
            </div>
          </div>
        </section>

        <LedgerSection label="Writing">
          {recentArticles.map((article) => (
            <LedgerRow
              key={article.slug}
              href={`/blog/${article.slug}`}
              title={article.title}
              description={article.excerpt}
              meta={formatDateLong(article.date)}
            />
          ))}
        </LedgerSection>

        <Footer />
      </main>

      <ViewModeToggle />
    </div>
  );
}
