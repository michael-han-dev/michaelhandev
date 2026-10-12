import { follow, spring, type Spring } from "../iso/react/live";
import { LANDED, LEAVES } from "./geometry";

export const T_COVER = 0.32;
export const T_ENDPAPER = 1.42;
export const T_RIFFLE = 2.6;
export const RIFFLE_FIRST = 0.15;
export const RIFFLE_RATIO = 0.84;
export const T_PUSH = 2.55;
export const T_END = 4.05;
export const HANDOFF = 0.9;
export const T_REVEAL = T_END - 0.85;

const COVER = { lift: 1.95, release: 1.62, stiffness: 26, damping: 10.2, gravity: 24, drag: 1.4, bounce: 0.3 };
const ENDPAPER = { lift: 2.1, release: 1.7, stiffness: 42, damping: 13 };
const LEAF = { gravity: 30, drag: 1.6, bounce: 0.16, flick: 12.5, flickGain: 0.35 };
const CURL = { gain: 0.085, most: 0.9 };

export interface Flap {
  at: number;
  rate: number;
  phase: "rest" | "held" | "free" | "landed";
  hand: Spring;
  start: number;
}

export interface Frame {
  t: number;
  lift: number;
  opacity: number;
  cover: Flap;
  leaves: Flap[];
  centre: number;
  push: number;
  approach: number;
}

const flap = (start: number): Flap => ({ at: 0, rate: 0, phase: "rest", hand: { at: 0, rate: 0 }, start });

export const releaseOf = (index: number) => {
  if (index === 0) return T_ENDPAPER;
  let at = T_RIFFLE;
  for (let k = 1; k < index; k++) at += RIFFLE_FIRST * Math.pow(RIFFLE_RATIO, k - 1);
  return at;
};

export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};

export const progressOf = (item: Flap) => Math.min(1, Math.max(0, item.at / LANDED));

export function curlOf(item: Flap) {
  const p = progressOf(item);
  const lag = Math.max(-CURL.most, Math.min(CURL.most, CURL.gain * item.rate));
  return lag * Math.sin(Math.PI * p);
}

const gapBehind = (ahead: number) => 0.05 * smoothstep(0, 0.35, LANDED - ahead);

export class BookModel {
  frame: Frame;
  private settle: Spring;

  constructor() {
    this.settle = { at: 1, rate: 0 };
    this.frame = this.fresh();
  }

  private fresh(): Frame {
    return {
      t: 0,
      lift: 1,
      opacity: 0,
      cover: flap(T_COVER),
      leaves: Array.from({ length: LEAVES }, (_, index) => flap(releaseOf(index))),
      centre: 0,
      push: 0,
      approach: 0,
    };
  }

  reset() {
    this.settle = { at: 1, rate: 0 };
    this.frame = this.fresh();
  }

  seek(time: number) {
    this.reset();
    const dt = 1 / 120;
    while (this.frame.t < time - 1e-9) this.step(Math.min(dt, time - this.frame.t));
    return this.frame;
  }

  step(dt: number) {
    const f = this.frame;
    f.t += dt;
    spring(this.settle, 0, dt, 90, 19);
    f.lift = this.settle.at;
    f.opacity = follow(f.opacity, 1, dt, 0.12);

    this.moveCover(f.cover, f.t, dt);
    f.leaves.forEach((leaf, index) => this.moveLeaf(leaf, index, f.t, dt));
    this.keepOrder(f);

    const open = smoothstep(0.15, 0.85, progressOf(f.cover));
    f.centre = follow(f.centre, open, dt, 0.32);
    f.push = Math.min(1, Math.max(0, (f.t - T_PUSH) / (T_END - T_PUSH)));
    f.approach = f.push * f.push;
    return f;
  }

  private integrate(item: Flap, dt: number, gravity: number, drag: number, bounce: number) {
    const steps = Math.max(1, Math.ceil(dt * 240));
    const slice = dt / steps;
    for (let step = 0; step < steps; step++) {
      item.rate += (-gravity * Math.cos(item.at) - drag * item.rate) * slice;
      item.at += item.rate * slice;
      if (item.at >= LANDED) {
        item.at = LANDED;
        item.rate = -Math.abs(item.rate) * bounce;
        if (Math.abs(item.rate) < 0.35) {
          item.rate = 0;
          item.phase = "landed";
          return;
        }
      }
      if (item.at <= 0) {
        item.at = 0;
        item.rate = 0;
      }
    }
  }

  private moveCover(cover: Flap, t: number, dt: number) {
    if (cover.phase === "landed") return;
    if (cover.phase === "rest") {
      if (t < cover.start) return;
      cover.phase = "held";
    }
    if (cover.phase === "held") {
      spring(cover.hand, COVER.lift, dt, COVER.stiffness, COVER.damping);
      cover.at = cover.hand.at;
      cover.rate = cover.hand.rate;
      if (cover.at >= COVER.release) cover.phase = "free";
      return;
    }
    this.integrate(cover, dt, COVER.gravity, COVER.drag, COVER.bounce);
  }

  private moveLeaf(leaf: Flap, index: number, t: number, dt: number) {
    if (leaf.phase === "landed") return;
    if (leaf.phase === "rest") {
      if (t < leaf.start) return;
      if (index === 0) {
        leaf.phase = "held";
      } else {
        leaf.phase = "free";
        leaf.rate = LEAF.flick + LEAF.flickGain * index;
      }
    }
    if (leaf.phase === "held") {
      spring(leaf.hand, ENDPAPER.lift, dt, ENDPAPER.stiffness, ENDPAPER.damping);
      leaf.at = leaf.hand.at;
      leaf.rate = leaf.hand.rate;
      if (leaf.at >= ENDPAPER.release) leaf.phase = "free";
      return;
    }
    this.integrate(leaf, dt, LEAF.gravity, LEAF.drag, LEAF.bounce);
  }

  private keepOrder(f: Frame) {
    let ahead = f.cover;
    for (const leaf of f.leaves) {
      const most = ahead.at - gapBehind(ahead.at);
      if (leaf.at > most && leaf.phase !== "rest") {
        leaf.at = Math.max(0, most);
        const shared = (leaf.rate + ahead.rate) / 2;
        if (ahead.phase !== "landed") ahead.rate = Math.max(ahead.rate, shared);
        leaf.rate = Math.min(leaf.rate, ahead.phase === "landed" ? 0 : ahead.rate);
        if (ahead.phase === "landed" && LANDED - leaf.at < 1e-3) {
          leaf.at = LANDED;
          leaf.rate = 0;
          leaf.phase = "landed";
        }
      }
      ahead = leaf;
    }
  }
}

export const riffleEnd = releaseOf(LEAVES - 1);
