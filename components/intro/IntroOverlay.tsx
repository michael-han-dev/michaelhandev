'use client';

import { useCallback, useRef, useState } from 'react';
import './intro.css';

const SKIP_FADE = 0.2;

export interface Cue {
  hint: boolean;
  leave: boolean;
}

export interface IntroPlayer<F> {
  play: (onTick: (frame: F) => void) => void;
  stop: () => void;
  resize: () => void;
}

interface IntroOverlayProps<F> {
  className: string;
  label: string;
  handoff: number;
  start: (svg: SVGSVGElement, layer: SVGGElement) => IntroPlayer<F>;
  cue: (frame: F) => Cue;
  onReveal: () => void;
  onDone: () => void;
}

export default function IntroOverlay<F>(props: IntroOverlayProps<F>) {
  const latest = useRef(props);
  latest.current = props;

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
    const player = latest.current.start(svg, layer);
    let leaving = false;
    let timer = 0;

    const leave = (seconds: number) => {
      if (leaving) return;
      leaving = true;
      setFade(seconds);
      latest.current.onReveal();
      timer = window.setTimeout(() => {
        player.stop();
        finish();
      }, seconds * 1000 + 40);
    };

    player.play((frame) => {
      const cue = latest.current.cue(frame);
      if (!cue.hint) setHintGone(true);
      if (cue.leave) leave(latest.current.handoff);
    });

    const skip = () => leave(SKIP_FADE);
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      skip();
    };
    const onResize = () => player.resize();
    node.addEventListener('pointerdown', skip);
    node.addEventListener('wheel', skip, { passive: true });
    node.addEventListener('touchmove', skip, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
      player.stop();
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
      className={`intro iso ${props.className}`}
      data-theme="light"
      role="presentation"
      style={fade === null ? undefined : { opacity: 0, pointerEvents: 'none', transition: `opacity ${fade}s ease-in-out` }}
    >
      <svg role="img" aria-label={props.label}>
        <g />
      </svg>
      <div className="intro-hint" style={{ opacity: hintGone ? 0 : 1 }}>
        click to skip
      </div>
    </div>
  );
}
