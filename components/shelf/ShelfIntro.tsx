'use client';

import { useRef } from 'react';
import '../iso/iso.css';
import './shelf.css';
import IntroOverlay from '../intro/IntroOverlay';
import { HANDOFF, LEAD } from './model';
import { createShelfPlayer, type Tick } from './player';
import type { Entry } from './titles';

export const SHELF_INTRO_SLUG = 'living-bookshelf';

const HINT_SPEED = 260;

interface ShelfIntroProps {
  entries: Entry[] | null;
  onReveal: () => void;
  onDone: () => void;
}

export default function ShelfIntro({ entries, onReveal, onDone }: ShelfIntroProps) {
  const source = useRef(entries);
  if (source.current !== entries) source.current = entries;

  return (
    <IntroOverlay<Tick>
      className="sh"
      label="A long shelf of books slides past from right to left, speeding up, until the last book leaves the screen"
      handoff={HANDOFF}
      start={(svg, layer) => createShelfPlayer(svg, layer, () => source.current)}
      cue={(tick) => ({ hint: tick.speed < HINT_SPEED, leave: tick.clearIn <= LEAD })}
      onReveal={onReveal}
      onDone={onDone}
    />
  );
}
