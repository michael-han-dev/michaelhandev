'use client';

import { motion } from 'framer-motion';
import { Code2, ArrowUpRight, Calendar, Github } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/projects';
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

export default function ProjectsPage() {
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
              <Link href="/writing" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                Writing
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
            All Projects
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer}
          >
            {projects.map((project, index) => (
              <motion.a
                key={project.id}
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
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors mb-3">{project.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                      <Calendar size={12} />
                      <time>{new Date(project.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</time>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-slate-700/30 rounded text-xs text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.section>

        <Footer />
      </motion.div>
    </div>
  );
}