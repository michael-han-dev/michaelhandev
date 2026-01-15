'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import Footer from '@/components/Footer';
import ViewModeToggle from '@/components/ViewModeToggle';
import { formatDateLong } from '@/utils/date';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function WritingPage() {
  return (
    <div className="min-h-screen bg-main">
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-12 pb-24"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.header 
          className="mb-16"
          variants={fadeInUp}
        >
          <div className="flex items-start justify-between">
            <div>
              <motion.h1 
                className="text-4xl md:text-3xl font-bold mb-3 text-white"
                variants={fadeInUp}
              >
                Michael Han
              </motion.h1>
              <motion.p 
                className="text-base text-slate-300 mb-1"
                variants={fadeInUp}
              >
                Technology optimist, chilli maker, athletics enjoyer, on a quest to maximize surface area for luck.
              </motion.p>
              <motion.p 
                className="text-base text-slate-300"
                variants={fadeInUp}
              >
                Mathematics and Computer Engineering at <span className="underline">Queen's University.</span>
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col space-y-1 items-end"
              variants={fadeInUp}
            >
              <Link href="/" className="group relative inline-flex items-center text-sm text-slate-400 hover:text-primary transition-colors">
                <motion.span
                  className="inline-block hotkey-glow"
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  Home
                </motion.span>
                <span className="absolute left-full ml-2 w-6 h-6 flex items-center justify-center border border-slate-400 group-hover:border-primary rounded text-xs opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  H
                </span>
              </Link>
              <Link href="/experience" className="group relative inline-flex items-center text-sm text-slate-400 hover:text-primary transition-colors">
                <motion.span
                  className="inline-block hotkey-glow"
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  Experiences
                </motion.span>
                <span className="absolute left-full ml-2 w-6 h-6 flex items-center justify-center border border-slate-400 group-hover:border-primary rounded text-xs opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  E
                </span>
              </Link>
              <Link href="/projects" className="group relative inline-flex items-center text-sm text-slate-400 hover:text-primary transition-colors">
                <motion.span
                  className="inline-block hotkey-glow"
                  initial={false}
                  animate={{ x: 0 }}
                  whileHover={{ x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  Projects
                </motion.span>
                <span className="absolute left-full ml-2 w-6 h-6 flex items-center justify-center border border-slate-400 group-hover:border-primary rounded text-xs opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                  P
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.header>

        <motion.section 
          className="mb-16"
          variants={fadeInUp}
        >
          <motion.h2 
            className="text-2xl font-semibold mb-8 text-white"
            variants={fadeInUp}
          >
            All Writing
          </motion.h2>
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
          >
            {articles.map((article, index) => (
              <motion.article 
                key={article.id}
                className="group bg-card-light rounded-2xl p-6 border border-slate-700/50 hover:border-primary/50 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <time>{formatDateLong(article.date)}</time>
                    </div>
                    {article.readTime && (
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{article.readTime} min read</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors duration-200">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{article.excerpt}</p>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <Footer />
      </motion.div>
      <ViewModeToggle />
    </div>
  );
}
