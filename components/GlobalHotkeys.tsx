'use client';

import { useEffect, useState } from 'react';

export default function GlobalHotkeys() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const isInputFocused = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isInputFocused) {
        return;
      }

      if (!event.ctrlKey && !event.metaKey && !event.altKey && !event.shiftKey) {
        if (event.key === 'G' || event.key === 'g') {
          event.preventDefault();
          window.open('https://github.com/michael-han-dev', '_blank', 'noopener,noreferrer');
        } else if (event.key === 'T' || event.key === 't') {
          event.preventDefault();
          window.open('https://x.com/michaelyhan_', '_blank', 'noopener,noreferrer');
        } else if (event.key === 'L' || event.key === 'l') {
          event.preventDefault();
          window.open('https://www.linkedin.com/in/michael-y-han/', '_blank', 'noopener,noreferrer');
        } else if (event.key === 'S' || event.key === 's') {
          event.preventDefault();
          window.open('https://github.com/michael-han-dev/michaelhandev', '_blank', 'noopener,noreferrer');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted]);

  return null;
}
