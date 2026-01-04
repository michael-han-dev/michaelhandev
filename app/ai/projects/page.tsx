'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ViewModeToggle from '@/components/ViewModeToggle';
import CopyPageButton from '@/components/CopyPageButton';
import { projects } from '@/data/projects';

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

export default function AiProjectsPage() {
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
            <MdLine># Michael Han - Projects</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Experience" url="/ai/experience" /> | <MdLink text="Writing" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>&nbsp;</MdLine>

            <MdLine>## All Projects</MdLine>
            <MdLine>&nbsp;</MdLine>

            {projects.map((project) => (
              <motion.div key={project.id} variants={fadeIn}>
                <MdLine>### {project.title}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>{project.description}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>**Technologies:** {project.technologies.join(', ')}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine><MdLink text="GitHub" url={project.github} /></MdLine>
                {project.demo && <MdLine><MdLink text="Demo" url={project.demo} /></MdLine>}
                <MdLine>&nbsp;</MdLine>
                <MdLine>---</MdLine>
                <MdLine>&nbsp;</MdLine>
              </motion.div>
            ))}

            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Experience" url="/ai/experience" /> | <MdLink text="Writing" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Source" url="https://github.com/michael-han-dev/michaelhandev" /></MdLine>
          </motion.div>
        </div>
      </motion.div>
      <ViewModeToggle />
    </>
  );
}

