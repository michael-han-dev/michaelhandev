'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ExternalLink, Calendar, Code2, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import GitHubChart from '@/components/GitHubChart';

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

const projects = [
  {
    title: "Project One",
    description: "A brief description of your first project. Explain what technologies you used and what problem it solves.",
    image: "/next.svg",
    github: "https://github.com/yourusername/project-one",
    demo: "https://project-one-demo.com"
  },
  {
    title: "Project Two", 
    description: "Another project description. Highlight the key features and your role in developing it.",
    image: "/vercel.svg",
    github: "https://github.com/yourusername/project-two",
    demo: "https://project-two-demo.com"
  },
  {
    title: "Project Three",
    description: "Your third project showcasing different skills. Mention any unique challenges you overcame.",
    image: "/globe.svg",
    github: "https://github.com/yourusername/project-three",
    demo: null
  }
];

const blogPosts = [
  {
    title: "My First Blog Post",
    excerpt: "This is a sample blog post excerpt. Replace with your actual blog content.",
    date: "2024-01-15",
    slug: "my-first-blog-post"
  },
  {
    title: "Learning Next.js",
    excerpt: "Thoughts and experiences while learning Next.js framework for React development.",
    date: "2024-01-08", 
    slug: "learning-nextjs"
  },
  {
    title: "Portfolio Development",
    excerpt: "The process of building this portfolio website from scratch using modern tools.",
    date: "2024-01-01",
    slug: "portfolio-development"
  }
];


export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: '#0a0f1c' }}>
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
                className="text-4xl md:text-5xl font-bold mb-3 text-white"
                variants={fadeInUp}
              >
                Your Name Here
              </motion.h1>
              <motion.p 
                className="text-base text-slate-300 mb-1"
                variants={fadeInUp}
              >
                Your short title/description here.
              </motion.p>
              <motion.p 
                className="text-base text-slate-300"
                variants={fadeInUp}
              >
                Computer Science at University.
              </motion.p>
              
              <motion.div 
                className="mt-6"
                variants={fadeInUp}
              >
                <div className="text-xs text-slate-500 mb-2">NOW</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Research engineering at <span className="underline decoration-green-400">Company</span>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-slate-300">Tinkering at Location.</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col space-y-1 text-right"
              variants={fadeInUp}
            >
              <a 
                href="https://linkedin.com/in/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                LinkedIn
              </a>
              <a 
                href="https://github.com/yourusername" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://twitter.com/yourusername" 
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
          <motion.h2 
            className="text-xl font-semibold mb-6 text-white"
            variants={fadeInUp}
          >
            Featured Projects
          </motion.h2>
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={staggerContainer}
          >
            {projects.map((project, index) => (
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
          <motion.h2 
            className="text-xl font-semibold mb-6 text-white"
            variants={fadeInUp}
          >
            Latest Thoughts
          </motion.h2>
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
          >
            {blogPosts.map((post, index) => (
              <motion.article 
                key={index}
                className="group border-b border-slate-700/30 pb-4 last:border-b-0"
                variants={fadeInUp}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Calendar size={12} />
                    <time>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</time>
                  </div>
                  <h3 className="text-base font-medium mb-2 text-white group-hover:text-blue-400 transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{post.excerpt}</p>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.footer 
          className="flex items-center justify-between pt-12 border-t border-slate-700/30"
          variants={fadeInUp}
        >
          <p className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
          <a 
            href="https://github.com/yourusername/portfolio-source"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs"
          >
            <Github size={12} />
            <span>Source</span>
          </a>
        </motion.footer>
      </motion.div>
    </div>
  );
}