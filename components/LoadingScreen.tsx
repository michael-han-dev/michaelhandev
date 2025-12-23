'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Georgia',
  'Courier New',
  'Verdana',
  'Impact',
  'Comic Sans MS',
  'Trebuchet MS',
  'Palatino',
  'Garamond',
  'Bookman',
  'Avant Garde',
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fontInterval = setInterval(() => {
      setCurrentFontIndex((prev) => (prev + 1) % fonts.length);
    }, 3000 / fonts.length);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2700);

    const completeTimer = setTimeout(() => {
      clearInterval(fontInterval);
      onComplete();
    }, 3000);

    return () => {
      clearInterval(fontInterval);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: '#000223' }}
      >
        <motion.h1
          key={currentFontIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05 }}
          className="text-6xl md:text-8xl font-bold text-white"
          style={{ fontFamily: fonts[currentFontIndex] }}
        >
          Michael
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
}
