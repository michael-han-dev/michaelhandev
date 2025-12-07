'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function GlobalHotkeys() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

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
        } else if (event.key === 'H' || event.key === 'h') {
          event.preventDefault();
          router.push('/');
        } else if (event.key === 'P' || event.key === 'p') {
          event.preventDefault();
          router.push('/projects');
        } else if (event.key === 'E' || event.key === 'e') {
          event.preventDefault();
          router.push('/experience');
        } else if (event.key === 'W' || event.key === 'w') {
          event.preventDefault();
          router.push('/writing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, router]);

  return null;
}
