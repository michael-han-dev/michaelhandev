'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, Github } from 'lucide-react';
import Link from 'next/link';
import { articles } from '@/data/articles';
import Footer from '@/components/Footer';

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
    <div className="min-h-screen" style={{ background: '#000223' }}>
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-12"
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
              className="flex flex-col space-y-1 text-right"
              variants={fadeInUp}
            >
              <Link href="/" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link href="/projects" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                Projects
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
                className="group bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300"
                variants={fadeInUp}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
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
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors duration-200">
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
    </div>
  );
}