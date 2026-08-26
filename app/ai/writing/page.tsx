'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ViewModeToggle from '@/components/ViewModeToggle';
import CopyPageButton from '@/components/CopyPageButton';
import { articles, isArchived, type Article } from '@/data/articles';
import { formatDateLong } from '@/utils/date';

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

function ArticleEntry({ article }: { article: Article }) {
  return (
    <motion.div variants={fadeIn}>
      <MdLine>### <MdLink text={article.title} url={`/ai/blog/${article.slug}`} /></MdLine>
      <MdLine>&nbsp;</MdLine>
      <MdLine>*{formatDateLong(article.date)}*{article.readTime && ` | ${article.readTime} min read`}</MdLine>
      <MdLine>&nbsp;</MdLine>
      <MdLine>{article.excerpt}</MdLine>
      <MdLine>&nbsp;</MdLine>
      <MdLine><MdLink text="Read more" url={`/ai/blog/${article.slug}`} /></MdLine>
      <MdLine>&nbsp;</MdLine>
      <MdLine>---</MdLine>
      <MdLine>&nbsp;</MdLine>
    </motion.div>
  );
}

export default function AiWritingPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const current = articles.filter((article) => !isArchived(article));
  const archived = articles.filter(isArchived);

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
            <MdLine># Michael Han - Writing</MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Projects" url="/ai/projects" /> | <MdLink text="Experience" url="/ai/experience" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine>&nbsp;</MdLine>

            <MdLine>## All Articles</MdLine>
            <MdLine>&nbsp;</MdLine>

            {current.map((article) => (
              <ArticleEntry key={article.id} article={article} />
            ))}

            <MdLine>## Archive</MdLine>
            <MdLine>&nbsp;</MdLine>

            {archived.map((article) => (
              <ArticleEntry key={article.id} article={article} />
            ))}

            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Home" url="/ai" /> | <MdLink text="Projects" url="/ai/projects" /> | <MdLink text="Experience" url="/ai/experience" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            <MdLine><MdLink text="Source" url="https://github.com/michael-han-dev/michaelhandev" /></MdLine>
          </motion.div>
        </div>
      </motion.div>
      <ViewModeToggle />
    </>
  );
}

