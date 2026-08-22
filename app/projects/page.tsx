'use client';

import Masthead from '@/components/Masthead';
import { LedgerSection, LedgerRow } from '@/components/Ledger';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  return (
    <div className="bg-main min-h-screen">
      <main className="page-enter mx-auto max-w-2xl px-6 pb-32 pt-16 md:pt-20">
        <Masthead />

        <LedgerSection label="All Projects">
          {projects.map((project, i) => (
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

        <Footer />
      </main>

      <ViewModeToggle />
    </div>
  );
}
