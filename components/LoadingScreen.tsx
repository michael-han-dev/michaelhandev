'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fonts = [
  'Impact',
  'Didot',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Futura',
  'Palatino',
  'Google Sans',
  'Rockwell',
  'Monaco',
  'Garamond',
  'Verdana',
  'Times New Roman',
  'Trebuchet MS',
  'Arial Black',
];

const calculateInterval = (index: number, baseInterval: number, increment: number) => {
  return baseInterval + (increment * index);
};

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const baseInterval = 150;
    const increment = 200;

    const totalDuration = fonts.reduce((sum, _, index) => {
      return sum + calculateInterval(index, baseInterval, increment);
    }, 0);

    let currentIndex = 0;

    const scheduleNext = () => {
      if (currentIndex >= fonts.length - 1) return;

      const nextInterval = calculateInterval(currentIndex, baseInterval, increment);

      const timer = setTimeout(() => {
        currentIndex++;
        setCurrentFontIndex(currentIndex);
        scheduleNext();
      }, nextInterval);

      return timer;
    };

    const firstTimer = scheduleNext();

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, totalDuration - 400);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 2000);

    return () => {
      if (firstTimer) clearTimeout(firstTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 1.7 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: '#000223' }}
      >
        <motion.h1
          key={currentFontIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.05 }}
          className="font-bold text-white"
          style={{
            fontFamily: fonts[currentFontIndex],
            fontSize: 'clamp(4rem, 25vw, 20rem)',
            whiteSpace: 'nowrap'
          }}
        >
          Michael
        </motion.h1>
      </motion.div>
    </AnimatePresence>
  );
}
