'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ShortcutSheet from '@/components/ShortcutSheet';

export default function GlobalHotkeys() {
  const [isMounted, setIsMounted] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

      if (event.key === '?') {
        event.preventDefault();
        setShowShortcuts((open) => !open);
        return;
      }

      if (event.key === 'Escape') {
        setShowShortcuts((open) => (open ? false : open));
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
          const isAiMode = pathname.startsWith('/ai');
          const humanPath =
            pathname === '/ai'
              ? '/'
              : pathname.startsWith('/ai/')
                ? pathname.replace('/ai', '')
                : '/';
          router.push(isAiMode ? humanPath : '/');
        } else if (event.key === 'P' || event.key === 'p') {
          event.preventDefault();
          const isAiMode = pathname.startsWith('/ai');
          router.push(isAiMode ? '/ai/projects' : '/projects');
        } else if (event.key === 'E' || event.key === 'e') {
          event.preventDefault();
          const isAiMode = pathname.startsWith('/ai');
          router.push(isAiMode ? '/ai/experience' : '/experience');
        } else if (event.key === 'W' || event.key === 'w') {
          event.preventDefault();
          const isAiMode = pathname.startsWith('/ai');
          router.push(isAiMode ? '/ai/writing' : '/writing');
        } else if (event.key === 'M' || event.key === 'm') {
          event.preventDefault();
          const isAiMode = pathname.startsWith('/ai');
          if (isAiMode) {
            if (pathname === '/ai') {
              router.push('/');
            } else {
              router.push(pathname.replace('/ai', ''));
            }
          } else {
            if (pathname === '/') {
              router.push('/ai');
            } else {
              router.push(`/ai${pathname}`);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, router, pathname]);

  return (
    <>
      <ShortcutSheet open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  );
}
