import { cameraOf, iso, type Flat, type Point3, type Projection } from "../iso/iso-kit";

export const PAGE_W = 120;
export const PAGE_H = 180;
export const BLOCK = 16;
export const BOARD = 2;
export const SQUARE = 2.5;
export const COVER_W = PAGE_W + SQUARE;
export const COVER_H = PAGE_H + SQUARE * 2;
export const HEAD = -PAGE_H / 2;
export const TAIL = PAGE_H / 2;
export const TOP = BOARD + BLOCK;
export const SPINE_BULGE = 5;
export const SEGMENTS = 24;
export const SEG = PAGE_W / SEGMENTS;
export const LEAVES = 13;
export const LEAF_GAP = 0.14;
export const DOG_EAR = 10;

export type XZ = [number, number];

const unit = ([x, y, z]: Point3): Point3 => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};

export const LIGHT = unit([-0.5, 0.32, 1]);

export const dot = (a: Point3, b: Point3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

export function shadeOf(normal: Point3) {
  const up = LIGHT[2];
  return Math.min(1, Math.max(0, (up - dot(normal, LIGHT)) / (up + 1)));
}

export function viewOf(P: Projection): Point3 {
  const { sinA, cosA, sinE, cosE } = cameraOf(P);
  return [cosA * cosE, sinA * cosE, sinE];
}

export const landedTilt = (() => {
  let lo = 0;
  let hi = 0.5;
  for (let step = 0; step < 60; step++) {
    const beta = (lo + hi) / 2;
    const z = TOP - COVER_W * Math.sin(beta) - BOARD * Math.cos(beta);
    if (z > 0) lo = beta;
    else hi = beta;
  }
  return (lo + hi) / 2;
})();

export const LANDED = Math.PI + landedTilt;

export function boardPoint(theta: number, u: number, w: number): XZ {
  return [u * Math.cos(theta) - w * Math.sin(theta), TOP + u * Math.sin(theta) + w * Math.cos(theta)];
}

export const BOARD_SECTION: XZ[] = [
  [0, 0],
  [COVER_W, 0],
  [COVER_W, BOARD - 0.6],
  [COVER_W - 0.6, BOARD],
  [0, BOARD],
];

export function spineJoint(theta: number): XZ {
  return boardPoint(theta, 0, BOARD);
}

export function spineCurve(theta: number, samples = 16, out = 0): XZ[] {
  const reach = SPINE_BULGE / 0.75;
  const [jx, jz] = spineJoint(theta);
  const p0: XZ = [0, 0];
  const p1: XZ = [-reach, 0];
  const p2: XZ = [jx - reach, jz];
  const p3: XZ = [jx, jz];
  const at = (t: number): XZ => {
    const m = 1 - t;
    const a = m * m * m;
    const b = 3 * m * m * t;
    const c = 3 * m * t * t;
    const d = t * t * t;
    return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
  };
  const points = Array.from({ length: samples + 1 }, (_, index) => at(index / samples));
  if (!out) return points;
  return points.map((point, index) => {
    const before = points[Math.max(0, index - 1)]!;
    const after = points[Math.min(points.length - 1, index + 1)]!;
    const tx = after[0] - before[0];
    const tz = after[1] - before[1];
    const length = Math.hypot(tx, tz) || 1;
    const fade = Math.min(1, index / 1.5, (samples - index) / 1.5);
    return [point[0] + (tz / length) * out * fade, point[1] - (tx / length) * out * fade] as XZ;
  });
}

export interface LeafShape {
  xs: number[];
  zs: number[];
  angles: number[];
}

export function leafShape(root: number, lag: number, rise: number): LeafShape {
  const xs = [0];
  const zs = [TOP];
  const angles: number[] = [];
  for (let k = 0; k < SEGMENTS; k++) {
    const u = (k + 0.5) * SEG;
    const angle = root - lag * Math.pow(u / PAGE_W, 1.5) - rise * Math.exp(-u / 3);
    angles.push(angle);
    xs.push(xs[k]! + SEG * Math.cos(angle));
    zs.push(zs[k]! + SEG * Math.sin(angle));
  }
  return { xs, zs, angles };
}

export function leafPoint(shape: LeafShape, u: number, v: number): Point3 {
  const k = Math.min(SEGMENTS - 1, Math.max(0, Math.floor(u / SEG)));
  const t = u / SEG - k;
  return [shape.xs[k]! + (shape.xs[k + 1]! - shape.xs[k]!) * t, v, shape.zs[k]! + (shape.zs[k + 1]! - shape.zs[k]!) * t];
}

export function headOf(dogEar: boolean, u: number) {
  if (!dogEar || u <= PAGE_W - DOG_EAR) return HEAD;
  return HEAD + (u - (PAGE_W - DOG_EAR));
}

export const RIBBON_PATH: Point3[] = [
  [40, 90.12, 11.4],
  [40.05, 90.16, 6.2],
  [40.1, 90.2, 3.0],
  [40.15, 90.5, 2.12],
  [40.3, 92.1, 2.1],
  [40.4, 92.62, 1.75],
  [40.45, 92.7, 0.7],
  [40.6, 93.3, 0.08],
  [42.0, 97.0, 0.08],
  [44.2, 101.5, 0.08],
  [47.6, 106.0, 0.08],
  [52.0, 110.2, 0.08],
  [56.6, 114.0, 0.08],
];

export const RIBBON_WIDTH = 3.4;

export const HEADBAND = { x: 1.1, y: TAIL + 0.35, r: 1.05, z0: BOARD, z1: TOP, wraps: 14 };

export const SPINE_BANDS = [-62, -30, 30, 62];

export const OPEN_EXTENT: Point3[] = [
  [-COVER_W, -COVER_H / 2, 0],
  [-COVER_W, COVER_H / 2, 0],
  [COVER_W, -COVER_H / 2, 0],
  [COVER_W, COVER_H / 2, 0],
  [COVER_W, COVER_H / 2 + 22, 0],
  [-COVER_W, -COVER_H / 2, TOP + 4],
  [COVER_W, -COVER_H / 2, TOP + 4],
  [0, -COVER_H / 2, TOP + 30],
];

export function project(point: Point3, P: Projection, lift = 0): Flat {
  return iso([point[0], point[1], point[2] + lift], P);
}

export function vectorOf(vector: Point3, P: Projection): Flat {
  const origin = iso([0, 0, 0], P);
  const end = iso(vector, P);
  return [end[0] - origin[0], end[1] - origin[1]];
}
