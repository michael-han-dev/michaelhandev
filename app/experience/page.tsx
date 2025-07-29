'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Calendar } from 'lucide-react';
import Link from 'next/link';
import { experiences } from '@/data/experience';
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

export default function ExperiencePage() {
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
            Professional Experience
          </motion.h2>
          <motion.div 
            className="space-y-6"
            variants={staggerContainer}
          >
            {experiences.map((experience, index) => (
              <motion.a
                key={experience.id}
                href={experience.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="absolute top-6 right-6 z-10">
                    <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <div className="pr-8">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-100 transition-colors mb-1">
                          {experience.title}
                        </h3>
                        <p className="text-blue-400 font-medium group-hover:text-blue-300 transition-colors">
                          {experience.company}
                        </p>
                      </div>
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          {new Date(experience.startDate).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short' 
                          })} - {experience.current ? 'Present' : new Date(experience.endDate!).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors">
                      {experience.description}
                    </p>
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