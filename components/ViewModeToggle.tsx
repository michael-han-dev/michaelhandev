'use client';

import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

export default function ViewModeToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const isAiMode = pathname.startsWith('/ai');

  const getHumanPath = () => {
    if (pathname === '/ai') return '/';
    if (pathname.startsWith('/ai/')) return pathname.replace('/ai', '');
    return pathname;
  };

  const getAiPath = () => {
    if (pathname === '/') return '/ai';
    if (pathname.startsWith('/ai')) return pathname;
    return `/ai${pathname}`;
  };

  const handleHumanClick = () => {
    router.push(getHumanPath());
  };

  const handleMachineClick = () => {
    router.push(getAiPath());
  };

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="flex items-center bg-black/80 backdrop-blur-sm border border-slate-700/50 rounded-full px-1 py-1">
        <button
          onClick={handleHumanClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            !isAiMode
              ? 'bg-transparent text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full border transition-all duration-300 ${
            !isAiMode ? 'bg-white border-white' : 'border-slate-500'
          }`} />
          HUMAN
        </button>
        <button
          onClick={handleMachineClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isAiMode
              ? 'bg-transparent text-white'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className={`w-2 h-2 rounded-full border transition-all duration-300 ${
            isAiMode ? 'bg-white border-white' : 'border-slate-500'
          }`} />
          MACHINE
        </button>
      </div>
    </motion.div>
  );
}
