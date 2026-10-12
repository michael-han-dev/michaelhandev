'use client';

import { useRef } from 'react';
import '../iso/iso.css';
import './book.css';
import IntroOverlay from '../intro/IntroOverlay';
import { HANDOFF, T_REVEAL, type Frame } from './model';
import { createPlayer, type Source } from './player';

export const BOOK_INTRO_SLUG = 'articles-worth-reading';

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
  const source = useRef<Source>({ titles, excerpt });
  if (source.current.titles !== titles || source.current.excerpt !== excerpt) {
    source.current = { titles, excerpt };
  }

  return (
    <IntroOverlay<Frame>
      className="bk"
      label="A cloth-bound book titled Articles worth reading opens, its pages riffle, and the view falls into the last blank page"
      handoff={HANDOFF}
      start={(svg, layer) => {
        const book = createPlayer(svg, layer, source.current);
        return {
          play: (onTick) => book.play(onTick, () => source.current),
          stop: book.stop,
          resize: book.resize,
        };
      }}
      cue={(frame) => ({ hint: frame.push <= 0.12, leave: frame.t >= T_REVEAL && ready })}
      onReveal={onReveal}
      onDone={onDone}
    />
  );
}
