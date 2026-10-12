import { canvasMeasure, fontsFor } from "../intro/fonts";
import { labelShelf, layoutShelf, type Shelf } from "./geometry";
import { ShelfModel, type Frame } from "./model";
import { lift, renderScene, screenX, viewOf, type View } from "./scene";
import type { Entry } from "./titles";

export interface Tick {
  t: number;
  speed: number;
  clearIn: number;
  progress: number;
}

export interface ShelfPlayer {
  play: (onTick: (tick: Tick) => void) => void;
  stop: () => void;
  resize: () => void;
  seek: (time: number) => void;
  frame: () => Frame | null;
  tick: () => Tick;
}

const WAIT = 0.4;
const IDLE_AFTER = 0.6;

export function createShelfPlayer(svg: SVGSVGElement, layer: SVGGElement, sourceOf: () => Entry[] | null): ShelfPlayer {
  let shelf: Shelf | null = null;
  let model: ShelfModel | null = null;
  let base: View | null = null;
  let fontsReady = false;
  let waited = 0;
  let raf = 0;
  let last = 0;
  let onTick: ((tick: Tick) => void) | undefined;

  fontsFor(svg).then(() => {
    fontsReady = true;
  });

  const stage = () => {
    const box = svg.getBoundingClientRect();
    return { width: Math.max(1, box.width), height: Math.max(1, box.height) };
  };

  const fit = () => {
    if (!shelf) return;
    const size = stage();
    base = viewOf(size, shelf);
    svg.setAttribute("viewBox", `0 0 ${size.width} ${size.height}`);
    svg.style.setProperty("--k", (Math.round(base.k * 1000) / 1000).toString());
  };

  const commit = () => {
    const entries = sourceOf();
    shelf = layoutShelf(entries && entries.length ? entries : null);
    labelShelf(shelf, canvasMeasure(svg));
    const swings = shelf.books.map((book) => ({ h: book.h, rest: book.lean, lo: book.pose === "up" ? book.lo : 0, hi: book.pose === "up" ? book.hi : 0 }));
    model = new ShelfModel(swings, shelf.lastRight - shelf.left);
    fit();
  };

  const draw = () => {
    if (!shelf || !model || !base) return;
    const frame = model.frame;
    layer.setAttribute("opacity", frame.opacity.toFixed(3));
    layer.innerHTML = renderScene(lift(base, frame), shelf, frame);
  };

  const tickOf = (): Tick => {
    if (!shelf || !model || !base) return { t: 0, speed: 0, clearIn: Infinity, progress: 0 };
    const frame = model.frame;
    const view = lift(base, frame);
    const remaining = Math.max(0, screenX(view, shelf.lastRight) / base.k);
    return { t: frame.t, speed: frame.v * base.k, clearIn: model.clearIn(remaining), progress: frame.s / (shelf.lastRight - shelf.left) };
  };

  const loop = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    if (!model) {
      waited += dt;
      const entries = sourceOf();
      if ((entries !== null && fontsReady) || waited >= WAIT) commit();
    }
    if (model && model.frame.t < 6 + IDLE_AFTER) {
      model.step(dt);
      draw();
    }
    onTick?.(tickOf());
    raf = requestAnimationFrame(loop);
  };

  return {
    play: (handler) => {
      onTick = handler;
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    },
    stop: () => {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    resize: () => {
      fit();
      draw();
    },
    seek: (time) => {
      if (!model) commit();
      model!.seek(time);
      draw();
    },
    frame: () => model?.frame ?? null,
    tick: tickOf,
  };
}
