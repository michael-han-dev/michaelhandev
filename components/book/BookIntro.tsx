'use client';

import { useCallback, useRef, useState } from 'react';
import '../iso/iso.css';
import './book.css';
import { HANDOFF, T_REVEAL } from './model';
import { createPlayer, type Source } from './player';

export const BOOK_INTRO_SLUG = 'articles-worth-reading';

const SKIP_FADE = 0.2;

export function titlesFrom(html: string) {
  if (typeof DOMParser === 'undefined' || !html) return [];
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('li a')].map((link) => link.textContent?.trim() ?? '').filter(Boolean);
}

interface BookIntroProps {
  titles: string[] | null;
  excerpt: string;
  ready: boolean;
  onReveal: () => void;
  onDone: () => void;
}

export default function BookIntro({ titles, excerpt, ready, onReveal, onDone }: BookIntroProps) {
  const latest = useRef({ ready, onReveal, onDone, source: { titles, excerpt } as Source });
  if (latest.current.source.titles !== titles || latest.current.source.excerpt !== excerpt) {
    latest.current.source = { titles, excerpt };
  }
  latest.current.ready = ready;
  latest.current.onReveal = onReveal;
  latest.current.onDone = onDone;

  const [fade, setFade] = useState<number | null>(null);
  const [hintGone, setHintGone] = useState(false);

  const mount = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const finish = () => latest.current.onDone();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    const svg = node.querySelector('svg');
    const layer = node.querySelector('g');
    if (!svg || !layer) return;
    const book = createPlayer(svg, layer, latest.current.source);
    let leaving = false;
    let timer = 0;

    const leave = (seconds: number) => {
      if (leaving) return;
      leaving = true;
      setFade(seconds);
      latest.current.onReveal();
      timer = window.setTimeout(() => {
        book.stop();
        finish();
      }, seconds * 1000 + 40);
    };

    book.play(
      (frame) => {
        if (frame.push > 0.12) setHintGone(true);
        if (frame.t >= T_REVEAL && latest.current.ready) leave(HANDOFF);
      },
      () => latest.current.source
    );

    const skip = () => leave(SKIP_FADE);
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      skip();
    };
    const onResize = () => book.resize();
    node.addEventListener('pointerdown', skip);
    node.addEventListener('wheel', skip, { passive: true });
    node.addEventListener('touchmove', skip, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
      book.stop();
      window.clearTimeout(timer);
      node.removeEventListener('pointerdown', skip);
      node.removeEventListener('wheel', skip);
      node.removeEventListener('touchmove', skip);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={mount}
      className="bk iso"
      data-theme="light"
      role="presentation"
      style={fade === null ? undefined : { opacity: 0, pointerEvents: 'none', transition: `opacity ${fade}s ease-in-out` }}
    >
      <svg role="img" aria-label="A cloth-bound book titled Articles worth reading opens, its pages riffle, and the view falls into the last blank page">
        <g />
      </svg>
      <div className="bk-hint" style={{ opacity: hintGone ? 0 : 1 }}>
        click to skip
      </div>
    </div>
  );
}
