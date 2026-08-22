'use client';

import Link from 'next/link';
import Masthead from '@/components/Masthead';
import { LedgerSection, LedgerRow } from '@/components/Ledger';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { getRecentArticles } from '@/data/articles';
import { getRecentExperiences } from '@/data/experience';
import { projects } from '@/data/projects';
import { formatDateLong, formatDateShort } from '@/utils/date';

export default function Home() {
  const recentArticles = getRecentArticles(4);
  const recentExperiences = getRecentExperiences(2);
  const featuredProjects = projects.slice(0, 2);

  return (
    <div className="bg-main min-h-screen">
      <main className="page-enter mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20">
        <Masthead />

        <section className="mt-16">
          <h1 className="text-lg leading-snug text-[var(--ink)]">
            Software engineer, occasional chilli chef, lifelong baseball guy.
          </h1>
          <p className="mt-6 leading-relaxed text-[var(--ink-2)]">
            On a quest to maximize surface area for luck. Mathematics and
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
                  Co-Founded{' '}
                  <span className="underline decoration-[var(--accent)] underline-offset-2">
                    Merin.ai
                  </span>
                  .
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="pulse-dot" />
                <span>Working on the engineering team at Rootly (YC S21).</span>
              </div>
            </div>
          </div>
        </section>

        <LedgerSection label="Selected work">
          {featuredProjects.map((project, i) => (
            <LedgerRow
              key={project.id}
              href={project.github}
              gutter={String(i + 1).padStart(2, '0')}
              title={project.title}
              description={project.description}
              meta={project.technologies.join(' · ')}
            />
          ))}
        </LedgerSection>

        <LedgerSection label="Experience">
          {recentExperiences.map((experience) => (
            <LedgerRow
              key={experience.id}
              href={experience.link}
              gutter={`${formatDateShort(experience.startDate)} – ${
                experience.current ? 'Present' : formatDateShort(experience.endDate!)
              }`}
              title={experience.title}
              description={experience.description}
              meta={experience.company}
            />
          ))}
        </LedgerSection>

        <LedgerSection label="Writing">
          {recentArticles.map((article) => (
            <LedgerRow
              key={article.slug}
              href={`/blog/${article.slug}`}
              gutter={article.date.slice(0, 4)}
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
