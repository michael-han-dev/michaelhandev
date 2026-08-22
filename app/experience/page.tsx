'use client';

import Masthead from '@/components/Masthead';
import { LedgerSection, LedgerRow } from '@/components/Ledger';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { experiences } from '@/data/experience';
import { formatDateShort } from '@/utils/date';

export default function ExperiencePage() {
  return (
    <div className="bg-main min-h-screen">
      <main className="page-enter mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20">
        <Masthead />

        <LedgerSection label="Professional Experience">
          {experiences.map((experience) => (
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

        <Footer />
      </main>

      <ViewModeToggle />
    </div>
  );
}
