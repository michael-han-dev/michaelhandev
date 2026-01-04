'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/data/articles';
import ViewModeToggle from '@/components/ViewModeToggle';
import CopyPageButton from '@/components/CopyPageButton';
import { useEffect, useState } from 'react';
import { formatDateLong } from '@/utils/date';

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.02
    }
  }
};

function MdLine({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="flex" variants={fadeIn}>
      <span className="text-slate-600 select-none mr-4 flex-shrink-0">│</span>
      <span className="whitespace-pre-wrap">{children}</span>
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

async function getRawMarkdown(slug: string): Promise<string> {
  try {
    const response = await fetch(`/blog-content/${slug}.md`);
    if (!response.ok) {
      throw new Error('Not found');
    }
    return await response.text();
  } catch {
    return '';
  }
}

export default function AiBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug);
      const foundArticle = articles.find(a => a.slug === slug);
      setArticle(foundArticle);
    });
  }, [params]);

  useEffect(() => {
    if (article) {
      getRawMarkdown(article.slug).then((content) => {
        setMarkdown(content);
        setLoading(false);
      });
    } else if (slug && !article) {
      setLoading(false);
    }
  }, [article, slug]);

  if (slug && !article && !loading) {
    notFound();
  }

  const lines = markdown.split('\n');

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
            <MdLine><MdLink text="← Back to writing" url="/ai/writing" /></MdLine>
            <MdLine>&nbsp;</MdLine>
            
            {article && (
              <>
                <MdLine># {article.title}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>*{formatDateLong(article.date)}*{article.readTime && ` | ${article.readTime} min read`}</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>**{article.excerpt}**</MdLine>
                <MdLine>&nbsp;</MdLine>
                <MdLine>---</MdLine>
                <MdLine>&nbsp;</MdLine>
              </>
            )}

            {loading ? (
              <MdLine>Loading...</MdLine>
            ) : (
              lines.map((line, index) => (
                <MdLine key={index}>{line || '\u00A0'}</MdLine>
              ))
            )}

            <MdLine>&nbsp;</MdLine>
            <MdLine>---</MdLine>
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

