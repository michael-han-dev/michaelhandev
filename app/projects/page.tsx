'use client';

import { motion } from 'framer-motion';
import { Code2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { getProjectImages, BlogImage } from '@/lib/images';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';

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
  const [projectImages, setProjectImages] = useState<Record<string, BlogImage[]>>({});

  useEffect(() => {
    const fetchAllProjectImages = async () => {
      const imagePromises = projects.map(async (project) => {
        const images = await getProjectImages(project.id);
        return { projectId: project.id, images };
      });
      
      const results = await Promise.all(imagePromises);
      const imageMap = results.reduce((acc, { projectId, images }) => {
        acc[projectId] = images;
        return acc;
      }, {} as Record<string, BlogImage[]>);
      
      setProjectImages(imageMap);
    };

    fetchAllProjectImages();
  }, []);

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
              <Link href="/experience" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                Experiences
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
            {projects.map((project) => (
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
                <div className="relative bg-slate-800/30 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col">
                  <div className="absolute top-3 right-3 z-10">
                    <ArrowUpRight size={14} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  
                  <div className="relative h-48 bg-slate-700/20 border-b border-slate-700/50 flex-shrink-0 overflow-hidden">
                    {projectImages[project.id] && projectImages[project.id].length > 0 && (
                      <img 
                        src={projectImages[project.id][0].url} 
                        alt={projectImages[project.id][0].alt_text || project.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                      />
                    )}
                  </div>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Code2 size={16} className="text-blue-400" />
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-100 transition-colors">{project.title}</h3>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors mb-3 flex-grow">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
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