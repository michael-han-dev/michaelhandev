'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ViewModeToggle from '@/components/ViewModeToggle';
import CopyPageButton from '@/components/CopyPageButton';
import { getRecentArticles } from '@/data/articles';
import { getRecentExperiences } from '@/data/experience';
import { projects } from '@/data/projects';
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

export default function AiHomePage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const recentArticles = getRecentArticles(4);
  const recentExperiences = getRecentExperiences(2);
  const featuredProjects = projects.slice(0, 2);

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
            <MdLine># Michael Han</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>Technology optimist, chilli maker, athletics enjoyer, on a quest to maximize surface area for luck.</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>Mathematics and Computer Engineering at <MdLink text="Queen's University" url="https://www.queensu.ca/" />. Expected to graduate in 2027.</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="LinkedIn" url="https://www.linkedin.com/in/michael-y-han/" /></MdLine>
            <MdLine><MdLink text="GitHub" url="https://github.com/michael-han-dev" /></MdLine>
            <MdLine><MdLink text="Twitter" url="https://x.com/michaelyhan_" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>## As of late:</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>- Co-Founded <MdLink text="Merin.ai" url="https://merin.ai" />.</MdLine>
            <MdLine>- Working on the engineering team at Rootly (YC S21).</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>&nbsp;</MdLine>

            <MdLine>## Professional Experience</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="View all" url="/ai/experience" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            {recentExperiences.map((experience) => (
              <motion.div key={experience.id} variants={fadeIn}>
                <MdLine>### {experience.title}</MdLine>
                <MdLine>**{experience.company}** | {formatDateShort(experience.startDate)} - {experience.current ? 'Present' : formatDateShort(experience.endDate!)}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>{experience.description}</MdLine>
                <MdLine>&nbsp;</MdLine>
                {experience.link && <MdLine><MdLink text="Learn more" url={experience.link} /></MdLine>}
                <MdLine>&nbsp;</MdLine>
              </motion.div>
            ))}
            <MdLine>&nbsp;</MdLine>

            <MdLine>## Featured Projects</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="View all" url="/ai/projects" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            {featuredProjects.map((project) => (
              <motion.div key={project.id} variants={fadeIn}>
                <MdLine>### {project.title}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>{project.description}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>Technologies: {project.technologies.join(', ')}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine><MdLink text="GitHub" url={project.github} /></MdLine>
                <MdLine>&nbsp;</MdLine>
              </motion.div>
            ))}
            <MdLine>&nbsp;</MdLine>

            <MdLine>## Latest Thoughts</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="View all" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            {recentArticles.map((article) => (
              <motion.div key={article.slug} variants={fadeIn}>
                <MdLine>### <MdLink text={article.title} url={`/ai/blog/${article.slug}`} /></MdLine>
                <MdLine>*{article.date}*</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>{article.excerpt}</MdLine>
                <MdLine>&nbsp;</MdLine>
              </motion.div>
            ))}
            <MdLine>&nbsp;</MdLine>

            <MdLine>## GitHub Activity</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>You made it this far? Here's some grass I'm growing.</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="View contributions" url="https://github.com/michael-han-dev" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>&nbsp;</MdLine>

            <MdLine>---</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>Michael Han <MdLink text="@michaelyhan_" url="https://x.com/michaelyhan_" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Projects" url="/ai/projects" /> | <MdLink text="Experience" url="/ai/experience" /> | <MdLink text="Writing" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Source" url="https://github.com/michael-han-dev/michaelhandev" /></MdLine>
          </motion.div>
        </div>
      </motion.div>
      <ViewModeToggle />
    </>
  );
}

