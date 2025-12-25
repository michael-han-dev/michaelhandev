'use client';

import { motion } from 'framer-motion';
import { Github, Home, Code2, PenTool, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useViewMode } from './ViewModeProvider';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Footer() {
  const { viewMode, toggleViewMode } = useViewMode();

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
            <span>Home</span>
          </Link>
          <Link href="/projects" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <span>Projects</span>
          </Link>
          <Link href="/experience" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <span>Experience</span>
          </Link>
          <Link href="/writing" className="flex items-center gap-1 text-slate-500 hover:text-blue-400 transition-colors text-xs">
            <span>Writing</span>
          </Link>
          <button
            onClick={toggleViewMode}
            className="group relative inline-flex items-center text-slate-500 hover:text-blue-400 transition-colors text-xs"
          >
            <motion.span
              className="inline-flex items-center gap-1 hotkey-glow-dark"
              initial={false}
              animate={{ x: 0 }}
              whileHover={{ x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {viewMode === 'human' ? 'Machine' : 'Human'}
            </motion.span>
            <span className="absolute left-full ml-2 w-6 h-6 flex items-center justify-center border border-slate-500 group-hover:border-blue-400 rounded text-xs opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              M
            </span>
          </button>
        </nav>
      </div>
      
      <a 
        href="https://github.com/michael-han-dev/michaelhandev"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative inline-flex items-center text-slate-500 hover:text-blue-400 transition-colors text-xs"
      >
        <motion.span
          className="inline-flex items-center gap-1 hotkey-glow-dark"
          initial={false}
          animate={{ x: 0 }}
          whileHover={{ x: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Github size={12} />
          Source
        </motion.span>
        <span className="absolute left-full ml-2 w-6 h-6 flex items-center justify-center border border-slate-500 group-hover:border-blue-400 rounded text-xs opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
          S
        </span>
      </a>
    </motion.footer>
  );
}