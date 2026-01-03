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
  'Copperplate',
  'Brush Script MT',
  'Consolas',
  'Baskerville',
  'Helvetica',
  'Century Gothic',
  'Optima',
  'Lucida Console',
  'Bookman',
  'Tahoma',
];

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const fontDuration = 170;
    const fadeStartIndex = 15;

    let currentIndex = 0;

    const scheduleNext = () => {
      if (currentIndex >= fonts.length - 1) {
        setTimeout(() => {
          onComplete();
        }, fontDuration);
        return;
      }

      const timer = setTimeout(() => {
        currentIndex++;
        setCurrentFontIndex(currentIndex);

        if (currentIndex === fadeStartIndex) {
          setIsExiting(true);
        }

        scheduleNext();
      }, fontDuration);

      return timer;
    };

    const firstTimer = scheduleNext();

    return () => {
      if (firstTimer) clearTimeout(firstTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 1.7 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-main"
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
