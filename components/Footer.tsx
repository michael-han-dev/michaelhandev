'use client';

import { motion } from 'framer-motion';
import { Github, Home, Code2, PenTool, Briefcase } from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Footer() {
  return (
    <motion.footer 
      className="flex items-center justify-between pt-12 border-t border-slate-700/30"
      variants={fadeInUp}
    >
      <div className="flex items-center gap-6">
        <p className="text-slate-500 text-xs">
          Michael Han <a href="https://x.com/michaelyhan_" target="_blank" className="hover:text-blue-400 transition-colors">
            @michaelyhan_
          </a>
        </p>
        
        <nav className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <Home size={12} />
            <span>Home</span>
          </Link>
          <Link href="/projects" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <Code2 size={12} />
            <span>Projects</span>
          </Link>
          <Link href="/experience" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <Briefcase size={12} />
            <span>Experience</span>
          </Link>
          <Link href="/writing" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <PenTool size={12} />
            <span>Writing</span>
          </Link>
        </nav>
      </div>
      
      <a 
        href="https://github.com/michael-han-dev/michaelhandev"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs"
      >
        <Github size={12} />
        <span>Source</span>
      </a>
    </motion.footer>
  );
}