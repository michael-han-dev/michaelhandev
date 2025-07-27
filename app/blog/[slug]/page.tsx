'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '@/data/articles';
import Footer from '@/components/Footer';
import { getBlogContent } from '@/lib/blog';
import { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    params.then(({ slug }) => {
      setSlug(slug);
      const foundArticle = articles.find(article => article.slug === slug);
      setArticle(foundArticle);
    });
  }, [params]);

  useEffect(() => {
    if (article) {
      getBlogContent(article.slug).then((content) => {
        setContent(content);
        setLoading(false);
        setTimeout(() => Prism.highlightAll(), 0);
      });
    } else {
      setLoading(false);
    }
  }, [article]);

  if (slug && !article && !loading) {
    notFound();
  }

  return (
    <div className="min-h-screen" style={{ background: '#000223' }}>
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-12"
        initial="initial"
        animate="animate"
      >
        <motion.div variants={fadeInUp}>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 mb-8 text-sm"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>
        </motion.div>

        <motion.article 
          className="bg-slate-800/30 rounded-2xl border border-slate-700/50 overflow-hidden mb-16"
          variants={fadeInUp}
        >
          {article && (
            <header className="p-8 border-b border-slate-700/30">
              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <time>{new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</time>
                </div>
                {article.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>{article.readTime} min read</span>
                  </div>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
                {article.title}
              </h1>
              <p className="text-lg text-slate-300">{article.excerpt}</p>
            </header>
          )}

          <div className="p-8">
            {loading ? (
              <div className="text-slate-400">Loading...</div>
            ) : (
              <div 
                className="prose prose-lg max-w-none prose-invert prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-blue-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
        </motion.article>

        <Footer />
      </motion.div>
    </div>
  );
}