import { follow, spring, type Spring } from "../iso/react/live";

export const T_GO = 0.26;
export const RAMP = 0.7;
export const T_CLEAR = 3.05;
export const LEAD = 0.36;
export const HANDOFF = 0.7;
export const SWAY = 0.045;
export const DROP = 10;

const SUBSTEP = 1 / 480;

export interface Swing {
  h: number;
  rest: number;
  lo: number;
  hi: number;
}

export interface Frame {
  t: number;
  s: number;
  v: number;
  a: number;
  opacity: number;
  lift: number;
  tilt: number[];
}

export const smoothstep = (edge0: number, edge1: number, value: number) => {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
};

const driveAt = (t: number) => smoothstep(T_GO, T_GO + RAMP, t);

function travelled(until: number) {
  let s = 0;
  let v = 0;
  for (let t = 0; t < until; t += SUBSTEP) {
    v += driveAt(t) * SUBSTEP;
    s += v * SUBSTEP;
  }
  return s;
}

const UNIT_TRAVEL = travelled(T_CLEAR);

export class ShelfModel {
  frame!: Frame;
  readonly accel: number;
  private settle: Spring = { at: 1, rate: 0 };
  private rates: number[] = [];

  constructor(private swings: Swing[], distance: number) {
    this.accel = distance / UNIT_TRAVEL;
    this.reset();
  }

  reset() {
    this.settle = { at: 1, rate: 0 };
    this.rates = this.swings.map(() => 0);
    this.frame = { t: 0, s: 0, v: 0, a: 0, opacity: 0, lift: 1, tilt: this.swings.map((swing) => swing.rest) };
  }

  seek(time: number) {
    this.reset();
    while (this.frame.t < time - 1e-9) this.step(Math.min(1 / 120, time - this.frame.t));
    return this.frame;
  }

  step(dt: number) {
    const f = this.frame;
    spring(this.settle, 0, dt, 110, 21);
    f.lift = this.settle.at;
    f.opacity = follow(f.opacity, 1, dt, 0.09);
    const steps = Math.max(1, Math.ceil(dt / SUBSTEP));
    const slice = dt / steps;
    for (let step = 0; step < steps; step++) {
      f.t += slice;
      f.a = this.accel * driveAt(f.t);
      f.v += f.a * slice;
      f.s += f.v * slice;
      this.swings.forEach((swing, index) => this.sway(swing, index, slice));
    }
    return f;
  }

  private sway(swing: Swing, index: number, dt: number) {
    const f = this.frame;
    const omega = 2 * Math.PI * 2.3 * Math.sqrt(230 / swing.h);
    const target = swing.rest + ((swing.rest < 0 ? SWAY * 0.45 : SWAY) * f.a) / this.accel;
    let theta = f.tilt[index]!;
    let rate = this.rates[index]!;
    rate += (-omega * omega * (theta - target) - 2 * 0.3 * omega * rate) * dt;
    theta += rate * dt;
    if (theta > swing.hi) {
      theta = swing.hi;
      rate = -rate * 0.15;
    } else if (theta < swing.lo) {
      theta = swing.lo;
      rate = -rate * 0.15;
    }
    f.tilt[index] = theta;
    this.rates[index] = rate;
  }

  clearIn(remaining: number) {
    const { v, a } = this.frame;
    if (remaining <= 0) return 0;
    if (a <= 1e-6) return v > 1e-6 ? remaining / v : Infinity;
    return (-v + Math.sqrt(v * v + 2 * a * remaining)) / a;
  }
}
