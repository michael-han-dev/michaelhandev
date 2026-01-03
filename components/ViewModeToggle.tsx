'use client';

import { motion } from 'framer-motion';
import { useViewMode } from './ViewModeProvider';

export default function ViewModeToggle() {
  const { viewMode, toggleViewMode } = useViewMode();

  return (
    <button
      onClick={toggleViewMode}
      className="group relative inline-flex items-center text-sm text-slate-400 hover:text-blue-400 transition-colors"
    >
      <motion.span
        className="inline-block hotkey-glow"
        initial={false}
        animate={{ x: 0 }}
        whileHover={{ x: -8 }}
        transition={{ duration: 0.2 }}
      >
        {viewMode === 'human' ? 'Machine' : 'Human'}
      </motion.span>
      <span className="absolute left-full ml-2 w-6 h-6 flex items-center justify-center border border-slate-400 group-hover:border-blue-400 rounded text-xs opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
        M
      </span>
    </button>
  );
}

