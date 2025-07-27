'use client';

import { motion } from 'framer-motion';
import { Github, Calendar, Code2, ArrowUpRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import GitHubChart from '@/components/GitHubChart';
import Footer from '@/components/Footer';
import { getRecentProjects } from '@/data/projects';
import { getRecentArticles } from '@/data/articles';

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

export default function Home() {
  const recentProjects = getRecentProjects(2);
  const recentArticles = getRecentArticles(3);
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
              
              <motion.div 
                className="mt-6"
                variants={fadeInUp}
              >
                <div className="text-xs text-slate-500 mb-2">As of late:</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ 
                        opacity: [1, 0.4, 1],
                        scale: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-sm text-slate-300">Co-Founded <span className="underline decoration-green-400">Merin.ai</span>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-2 h-2 bg-blue-400 rounded-full"
                      animate={{ 
                        opacity: [1, 0.4, 1],
                        scale: [1, 0.9, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <span className="text-sm text-slate-300">Tinkering at Toronto.</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col space-y-1 text-right"
              variants={fadeInUp}
            >
              <a 
                href="https://www.linkedin.com/in/michael-y-han/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/michael-han-dev" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://x.com/michaelyhan_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                Twitter
              </a>
            </motion.div>
          </div>
        </motion.header>

        <motion.section 
          className="mb-20"
          variants={fadeInUp}
        >
          <motion.div 
            variants={fadeInUp}
          >
            <GitHubChart />
          </motion.div>
        </motion.section>

        <motion.section 
          className="mb-16"
          variants={fadeInUp}
        >
          <motion.div className="flex items-center justify-between mb-6" variants={fadeInUp}>
            <h2 className="text-xl font-semibold text-white">Featured Projects</h2>
            <Link href="/projects" className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400 transition-colors">
              <span>View all</span>
              <ExternalLink size={14} />
            </Link>
          </motion.div>
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer}
          >
            {recentProjects.map((project, index) => (
              <motion.a
                key={index}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="absolute top-3 right-3 z-10">
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <div className="aspect-video bg-slate-700/20 flex items-center justify-center p-8 border-b border-slate-700/50">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="max-h-full max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 size={16} className="text-blue-400" />
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">{project.description}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          className="mb-16"
          variants={fadeInUp}
        >
          <motion.div className="flex items-center justify-between mb-6" variants={fadeInUp}>
            <h2 className="text-xl font-semibold text-white">Latest Thoughts</h2>
            <Link href="/writing" className="flex items-center gap-1 text-sm text-slate-400 hover:text-blue-400 transition-colors">
              <span>View all</span>
              <ExternalLink size={14} />
            </Link>
          </motion.div>
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
          >
            {recentArticles.map((article, index) => (
              <motion.article 
                key={index}
                className="group border-b border-slate-700/30 pb-4 last:border-b-0"
                variants={fadeInUp}
              >
                <Link href={`/blog/${article.slug}`} className="block">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Calendar size={12} />
                    <time>{new Date(article.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</time>
                  </div>
                  <h3 className="text-base font-medium mb-2 text-white group-hover:text-blue-400 transition-colors duration-200">
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