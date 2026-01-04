'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ViewModeToggle from '@/components/ViewModeToggle';
import CopyPageButton from '@/components/CopyPageButton';
import { experiences } from '@/data/experience';
import { formatDateShort } from '@/utils/date';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

function MdLine({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="flex" variants={fadeIn}>
      <span className="text-slate-600 select-none mr-4 flex-shrink-0">│</span>
      <span>{children}</span>
    </motion.div>
  );
}

function MdLink({ text, url }: { text: string; url: string }) {
  const isInternal = url.startsWith('/');
  if (isInternal) {
    return (
      <Link href={url} className="hover:text-blue-400 transition-colors">
        [{text}]({url})
      </Link>
    );
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
      [{text}]({url})
    </a>
  );
}

export default function AiExperiencePage() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <CopyPageButton contentRef={contentRef} />
      <motion.div
        className="min-h-screen bg-black font-mono text-slate-300 text-sm leading-relaxed"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="max-w-4xl mx-auto px-4 py-12 pb-24">
          <motion.div ref={contentRef} className="space-y-1" variants={staggerContainer}>
            <MdLine># Michael Han - Professional Experience</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Projects" url="/ai/projects" /> | <MdLink text="Writing" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>&nbsp;</MdLine>

            <MdLine>## All Experience</MdLine>
            <MdLine>&nbsp;</MdLine>

            {experiences.map((experience) => (
              <motion.div key={experience.id} variants={fadeIn}>
                <MdLine>### {experience.title}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>**{experience.company}**</MdLine>
                <MdLine>*{formatDateShort(experience.startDate)} - {experience.current ? 'Present' : formatDateShort(experience.endDate!)}*</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>{experience.description}</MdLine>
                <MdLine>&nbsp;</MdLine>
                {experience.link && <MdLine><MdLink text="Learn more" url={experience.link} /></MdLine>}
                <MdLine>&nbsp;</MdLine>
                <MdLine>---</MdLine>
                <MdLine>&nbsp;</MdLine>
              </motion.div>
            ))}

            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Projects" url="/ai/projects" /> | <MdLink text="Writing" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Source" url="https://github.com/michael-han-dev/michaelhandev" /></MdLine>
          </motion.div>
        </div>
      </motion.div>
      <ViewModeToggle />
    </>
  );
}

