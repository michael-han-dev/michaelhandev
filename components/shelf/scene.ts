import { cameraOf, pathOf, type Flat, type Point3 } from "../iso/iso-kit";
import { AZIMUTH, BEVEL, BOARD_D, BOARD_T, ELEVATION, leftOf, rightOf, type Book, type Label, type Shelf } from "./geometry";
import { DROP, type Frame } from "./model";

export interface Stage {
  width: number;
  height: number;
}

export interface View {
  k: number;
  ox: number;
  oy: number;
  s: number;
  width: number;
  height: number;
}

const CAM = cameraOf({ origin: [0, 0], scale: 1, azimuth: AZIMUTH, elevation: ELEVATION });
const VIEW: Point3 = [CAM.cosA * CAM.cosE, CAM.sinA * CAM.cosE, CAM.sinE];

const unit = ([x, y, z]: Point3): Point3 => {
  const length = Math.hypot(x, y, z) || 1;
  return [x / length, y / length, z / length];
};
const dot = (a: Point3, b: Point3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const sub = (a: Point3, b: Point3): Point3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Point3, b: Point3): Point3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

const LIGHT = unit([-0.42, 0.5, 0.76]);
const CREASE = Math.cos((20 * Math.PI) / 180);
const PAGE = "#efe7d4";
const STAINED = "#d3b45e";
const ENDPAPER = "#c9bea8";
const WOOD = "#b8946a";
const IRON = "#47423d";
const STONE = "#9b968d";

const n = (value: number) => {
  const text = (Math.round(value * 100) / 100).toString();
  return text === "-0" ? "0" : text;
};

export function shadeOf(normal: Point3) {
  const light = dot(normal, LIGHT);
  return { s: Math.min(1, Math.max(0, 0.62 - light) * 0.62), h: Math.max(0, light - 0.62) * 0.5 };
}

const SPAN_TOP = (tallest: number) => 5 * CAM.sinE - tallest * CAM.cosE;
const SPAN_BOARD = BOARD_D * CAM.sinE + BOARD_T * CAM.cosE;

export function viewOf(stage: Stage, shelf: Shelf): View {
  const top = SPAN_TOP(shelf.tallest);
  const span = SPAN_BOARD - top;
  const byHeight = (stage.height * 0.64) / span;
  const k = Math.min(byHeight, stage.width / 250);
  const oy = k < byHeight ? stage.height * 0.46 - ((top + SPAN_BOARD) / 2) * k : stage.height * 0.15 - top * k;
  return { k, ox: -20, oy, s: 0, width: stage.width, height: stage.height };
}

const at = (v: View, [x, y, z]: Point3): Flat => {
  const wx = x - v.s;
  return [v.ox + (wx * CAM.sinA - y * CAM.cosA) * v.k, v.oy + ((wx * CAM.cosA + y * CAM.sinA) * CAM.sinE - z * CAM.cosE) * v.k];
};

const toward = (v: View, [x, y, z]: Point3): Flat => [(x * CAM.sinA - y * CAM.cosA) * v.k, ((x * CAM.cosA + y * CAM.sinA) * CAM.sinE - z * CAM.cosE) * v.k];

const path = (v: View, points: Point3[], closed = false) => pathOf(points.map((point) => at(v, point)), closed);

const fill = (v: View, points: Point3[], colour: string, normal: Point3, seam = false) => {
  const { s, h } = shadeOf(normal);
  return `<path class="sh-f${seam ? " sh-seam" : ""}" style="--c:${colour};--s:${n(s)};--h:${n(h)}" d="${path(v, points, true)}"/>`;
};

const flat = (v: View, points: Point3[], colour: string, opacity = 1) =>
  `<path fill="${colour}"${opacity < 1 ? ` fill-opacity="${n(opacity)}"` : ""} d="${path(v, points, true)}"/>`;

const stroke = (d: string, colour: string, width: number, opacity = 1) =>
  d ? `<path class="sh-l" stroke="${colour}"${opacity < 1 ? ` stroke-opacity="${n(opacity)}"` : ""} style="--w:${n(width)}" d="${d}"/>` : "";

interface Side {
  pts: Point3[];
  n: Point3;
  vis: boolean;
}

interface Prism {
  sides: Side[];
  low: Side;
  high: Side;
}

type Section = [number, number][];

function prism(section: Section, place: (p: number, q: number, s: number) => Point3, s0: number, s1: number): Prism {
  const count = section.length;
  const mid = (s0 + s1) / 2;
  const centre = section.reduce<Point3>((sum, [p, q]) => {
    const point = place(p, q, mid);
    return [sum[0] + point[0] / count, sum[1] + point[1] / count, sum[2] + point[2] / count];
  }, [0, 0, 0]);
  const face = (pts: Point3[]): Side => {
    let normal = unit(cross(sub(pts[1]!, pts[0]!), sub(pts[pts.length - 1]!, pts[0]!)));
    const middle = pts.reduce<Point3>((sum, point) => [sum[0] + point[0] / pts.length, sum[1] + point[1] / pts.length, sum[2] + point[2] / pts.length], [0, 0, 0]);
    if (dot(normal, sub(middle, centre)) < 0) normal = [-normal[0], -normal[1], -normal[2]];
    return { pts, n: normal, vis: dot(normal, VIEW) > 1e-4 };
  };
  const sides = section.map(([p, q], index) => {
    const [p2, q2] = section[(index + 1) % count]!;
    return face([place(p, q, s0), place(p2, q2, s0), place(p2, q2, s1), place(p, q, s1)]);
  });
  return { sides, low: face(section.map(([p, q]) => place(p, q, s0))), high: face(section.map(([p, q]) => place(p, q, s1))) };
}

function outline(v: View, solid: Prism, creases = true) {
  const edge: string[] = [];
  const crease: string[] = [];
  const count = solid.sides.length;
  const add = (a: Side, b: Side, points: Point3[]) => {
    if (a.vis !== b.vis) edge.push(path(v, points));
    else if (creases && a.vis && dot(a.n, b.n) < CREASE) crease.push(path(v, points));
  };
  solid.sides.forEach((side, index) => {
    const before = solid.sides[(index + count - 1) % count]!;
    add(before, side, [side.pts[0]!, side.pts[3]!]);
    add(side, solid.low, [side.pts[0]!, side.pts[1]!]);
    add(side, solid.high, [side.pts[3]!, side.pts[2]!]);
  });
  return (crease.length ? `<path class="sh-crease" d="${crease.join("")}"/>` : "") + (edge.length ? `<path class="sh-edge" d="${edge.join("")}"/>` : "");
}

function solidSvg(v: View, solid: Prism, colour: string, creases = true) {
  const out: string[] = [];
  solid.sides.forEach((side) => side.vis && out.push(fill(v, side.pts, colour, side.n)));
  if (solid.low.vis) out.push(fill(v, solid.low.pts, colour, solid.low.n));
  if (solid.high.vis) out.push(fill(v, solid.high.pts, colour, solid.high.n));
  return out.join("") + outline(v, solid, creases);
}

const box = (x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) =>
  prism(
    [
      [x0, y0],
      [x1, y0],
      [x1, y1],
      [x0, y1],
    ],
    (x, y, z) => [x, y, z],
    z0,
    z1
  );

interface Pose {
  map: (point: Point3) => Point3;
  rot: (normal: Point3) => Point3;
}

function poseOf(book: Book, theta: number): Pose {
  if (book.pose === "flat") {
    return {
      map: ([a, b, c]) => [book.x + book.h - c, b, book.z + a],
      rot: ([a, b, c]) => [-c, b, a],
    };
  }
  const pivot = theta > 0 ? book.t : 0;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return {
    map: ([a, b, c]) => [book.x + pivot + (a - pivot) * cos + c * sin, b, -(a - pivot) * sin + c * cos],
    rot: ([a, b, c]) => [a * cos + c * sin, b, -a * sin + c * cos],
  };
}

const CURVE = 8;

const bulgeAt = (book: Book, a: number) => (book.bulge * 4 * a * (book.t - a)) / (book.t * book.t);
const slopeAt = (book: Book, a: number) => (book.bulge * 4 * (book.t - 2 * a)) / (book.t * book.t);

function sectionOf(book: Book): Section {
  const { t, back } = book;
  const front = back + book.d;
  const section: Section = [
    [0, back],
    [t, back],
    [t, front],
  ];
  if (book.bulge > 0) for (let step = 1; step < CURVE; step++) {
    const a = t * (1 - step / CURVE);
    section.push([a, front + bulgeAt(book, a)]);
  }
  section.push([0, front]);
  return section;
}

interface Spine {
  pose: Pose;
  book: Book;
  front: number;
  facets: number[];
}

const surf = (spine: Spine, u: number, v: number): Point3 => spine.pose.map([u, spine.front + bulgeAt(spine.book, u), spine.book.h - v]);

const across = (spine: Spine, u: number) => spine.pose.rot(unit([1, slopeAt(spine.book, u), 0]));

function strip(spine: Spine, u0: number, u1: number, v0: number, v1: number): Point3[] {
  const samples = spine.book.bulge > 0 ? Math.max(1, Math.ceil(((u1 - u0) / spine.book.t) * CURVE)) : 1;
  const top: Point3[] = [];
  const bottom: Point3[] = [];
  for (let step = 0; step <= samples; step++) {
    const u = u0 + ((u1 - u0) * step) / samples;
    top.push(surf(spine, u, v0));
    bottom.push(surf(spine, u, v1));
  }
  return [...top, ...bottom.reverse()];
}

function paint(v: View, spine: Spine, u0: number, u1: number, v0: number, v1: number, colour: string) {
  const out: string[] = [];
  const { facets } = spine;
  for (let index = 0; index < facets.length - 1; index++) {
    const a = Math.max(u0, facets[index]!);
    const b = Math.min(u1, facets[index + 1]!);
    if (b - a < 1e-6) continue;
    const normal = spine.pose.rot(unit([-(slopeAt(spine.book, (a + b) / 2)), 1, 0]));
    out.push(fill(v, [surf(spine, a, v0), surf(spine, b, v0), surf(spine, b, v1), surf(spine, a, v1)], colour, normal, true));
  }
  return out.join("");
}

function rule(v: View, spine: Spine, at: number) {
  return path(v, spine.book.bulge > 0 ? Array.from({ length: CURVE + 1 }, (_, step) => surf(spine, (spine.book.t * step) / CURVE, at)) : [surf(spine, 0, at), surf(spine, spine.book.t, at)]);
}

const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function labelSvg(v: View, spine: Spine, label: Label, ink: string) {
  const down: Point3 = spine.pose.rot([0, 0, -1]);
  let e1: Point3;
  let e2: Point3;
  let origin: Point3;
  if (label.along === "v") {
    const base = label.u - 0.35 * label.size;
    const side = across(spine, label.u);
    e1 = down;
    e2 = [-side[0], -side[1], -side[2]];
    origin = surf(spine, base, label.v);
  } else {
    e1 = across(spine, label.u);
    e2 = down;
    origin = surf(spine, label.u, label.v + 0.35 * label.size);
  }
  const a = toward(v, e1);
  const b = toward(v, e2);
  const o = at(v, origin);
  const spacing = label.spacing ? ` letter-spacing="${n(label.spacing)}"` : "";
  return `<text class="sh-t" data-font="${label.font}" fill="${ink}" font-size="${n(label.size)}"${spacing} text-anchor="${label.anchor}" textLength="${n(label.width)}" lengthAdjust="spacingAndGlyphs" transform="matrix(${n(a[0])} ${n(a[1])} ${n(b[0])} ${n(b[1])} ${n(o[0])} ${n(o[1])})">${escape(label.text)}</text>`;
}

function stampSvg(v: View, spine: Spine, ink: string) {
  const { book } = spine;
  const u = book.t / 2;
  const c = book.h - 8.5;
  const r = Math.min(2.1, book.t * 0.12);
  const ring = (radius: number) => Array.from({ length: 14 }, (_, step) => surf(spine, u + radius * Math.cos((step / 14) * Math.PI * 2), c + radius * Math.sin((step / 14) * Math.PI * 2)));
  if (book.stamp === "dot") return flat(v, ring(r), ink);
  if (book.stamp === "ring") return stroke(path(v, ring(r), true), ink, 0.32);
  if (book.stamp === "bar") return flat(v, [surf(spine, u - r * 1.3, c - r * 0.45), surf(spine, u + r * 1.3, c - r * 0.45), surf(spine, u + r * 1.3, c + r * 0.45), surf(spine, u - r * 1.3, c + r * 0.45)], ink);
  return flat(v, [surf(spine, u, c - r), surf(spine, u + r, c + r * 0.8), surf(spine, u - r, c + r * 0.8)], ink);
}

function capSvg(v: View, book: Book, pose: Pose, solid: Prism, section: Section) {
  const { t, back, h } = book;
  const front = back + book.d;
  const top = solid.high.n;
  const at3 = (a: number, b: number, c: number) => pose.map([a, b, c]);
  const out: string[] = [];
  out.push(fill(v, solid.high.pts, book.kind === "hard" ? book.colour : book.kind === "mass" ? STAINED : PAGE, top));
  const pageLines = (a0: number, a1: number, b0: number, b1: number, c: number) => {
    const lines = [0.24, 0.47, 0.71].map((f) => path(v, [at3(a0 + (a1 - a0) * f, b0, c), at3(a0 + (a1 - a0) * f, b1, c)]));
    return stroke(lines.join(""), "#8e8270", 0.16, 0.45);
  };
  if (book.kind === "hard") {
    const bt = book.boardT;
    const sp = 1.6;
    const sq = book.square;
    out.push(fill(v, [at3(bt, back, h), at3(t - bt, back, h), at3(t - bt, front - sp, h), at3(bt, front - sp, h)], ENDPAPER, pose.rot([1, 0, 0])));
    out.push(fill(v, [at3(bt, back + sq, h - sq), at3(t - bt, back + sq, h - sq), at3(t - bt, front - sp, h - sq), at3(bt, front - sp, h - sq)], PAGE, top));
    out.push(pageLines(bt, t - bt, back + sq, front - sp, h - sq));
    const band = [at3(bt, front - sp - 2.2, h - sq + 1.6), at3(t - bt, front - sp - 2.2, h - sq + 1.6), at3(t - bt, front - sp, h - sq + 1.6), at3(bt, front - sp, h - sq + 1.6)];
    out.push(flat(v, band, "#7d2f28"));
    const stripes = Array.from({ length: Math.floor((t - 2 * bt) / 1.2) }, (_, step) => bt + 0.6 + step * 1.2).map((a) => path(v, [at3(a, front - sp - 2.2, h - sq + 1.6), at3(a, front - sp, h - sq + 1.6)]));
    out.push(stroke(stripes.join(""), "#efe3c4", 0.3, 0.8));
    const rim = section.filter(([, b]) => b >= front - 1e-6).map(([a, b]) => at3(a, b, h));
    out.push(fill(v, [at3(t, front - sp, h), ...rim, at3(0, front - sp, h)], book.colour, top));
    out.push(`<path class="sh-crease" d="${path(v, [at3(bt, back, h), at3(bt, front - sp, h), at3(t - bt, front - sp, h), at3(t - bt, back, h)])}"/>`);
  } else {
    const cv = 0.45;
    out.push(pageLines(cv, t - cv, back, front - cv, h));
    out.push(fill(v, [at3(0, back, h), at3(0, front, h), at3(t, front, h), at3(t, back, h), at3(t - cv, back, h), at3(t - cv, front - cv, h), at3(cv, front - cv, h), at3(cv, back, h)], book.colour, top));
  }
  return out.join("");
}

function bookSvg(v: View, book: Book, theta: number, crown: boolean) {
  const pose = poseOf(book, theta);
  const section = sectionOf(book);
  const solid = prism(section, (a, b, c) => pose.map([a, b, c]), 0, book.h);
  const count = section.length;
  const isSpine = (index: number) => index >= 2 && index <= count - 2;
  const out: string[] = [];

  solid.sides.forEach((side, index) => {
    if (!side.vis || isSpine(index)) return;
    out.push(fill(v, side.pts, book.colour, side.n));
    if (crown && index === 1) {
      const inset = 9;
      const frame = [
        pose.map([book.t, book.back + inset, inset]),
        pose.map([book.t, book.back + book.d - inset, inset]),
        pose.map([book.t, book.back + book.d - inset, book.h - inset]),
        pose.map([book.t, book.back + inset, book.h - inset]),
      ];
      out.push(stroke(path(v, frame, true), book.foil ? book.ink : "#1c1714", 0.3, book.foil ? 0.75 : 0.25));
    }
  });
  if (solid.high.vis) out.push(capSvg(v, book, pose, solid, section));

  const front = book.back + book.d;
  const facets = book.bulge > 0 ? Array.from({ length: CURVE + 1 }, (_, step) => (book.t * step) / CURVE) : [0, book.t];
  const spine: Spine = { pose, book, front, facets };
  out.push(paint(v, spine, 0, book.t, 0, book.h, book.colour));

  const { t, h } = book;
  if (book.finish === "cloth") out.push(`<path fill="url(#sh-weave)" d="${path(v, strip(spine, 0, t, 0, h), true)}"/>`);
  if (book.band) out.push(paint(v, spine, 0, t, book.band.v0, book.band.v1, book.band.colour));
  if (book.finish === "jacket") {
    out.push(paint(v, spine, 0, t, 0, 1.3, "#2b2622"));
    out.push(paint(v, spine, 0, t, h - 1.3, h, "#2b2622"));
  }
  if (book.gloss) {
    out.push(flat(v, strip(spine, t * 0.15, t * 0.24, 0, h), "#ffffff", 0.13));
    out.push(flat(v, strip(spine, t * 0.29, t * 0.315, 0, h), "#ffffff", 0.09));
  }
  const light = book.ink !== "#2a2420";
  for (const u of book.cracks) {
    const x = u * t;
    const head = h * (0.18 + (u % 0.1));
    const tail = h * (0.12 + (u % 0.07));
    out.push(flat(v, [surf(spine, x - 0.3, 0), surf(spine, x + 0.3, 0), surf(spine, x, head)], light ? "#ffffff" : "#000000", light ? 0.3 : 0.16));
    out.push(flat(v, [surf(spine, x - 0.3, h), surf(spine, x + 0.3, h), surf(spine, x, h - tail)], light ? "#ffffff" : "#000000", light ? 0.3 : 0.16));
  }
  if (book.worn) {
    const rub = "#ddd1b9";
    const corner = Math.min(3.4, t * 0.18);
    out.push(flat(v, [surf(spine, 0, 0), surf(spine, corner, 0), surf(spine, 0, corner * 0.8)], rub, 0.55));
    out.push(flat(v, [surf(spine, t, 0), surf(spine, t - corner, 0), surf(spine, t, corner * 0.8)], rub, 0.55));
    out.push(flat(v, [surf(spine, 0, h), surf(spine, corner, h), surf(spine, 0, h - corner * 0.8)], rub, 0.55));
    out.push(flat(v, [surf(spine, t, h), surf(spine, t - corner, h), surf(spine, t, h - corner * 0.8)], rub, 0.55));
    out.push(flat(v, strip(spine, 0, t, 0, 0.9), rub, 0.3));
  }
  if (book.bulge > book.t * 0.05) {
    const joints = [1.3, t - 1.3].map((u) => path(v, [surf(spine, u, 0), surf(spine, u, h)]));
    out.push(stroke(joints.join(""), "#000000", 0.3, 0.3));
  }
  if (book.rules.length) out.push(stroke(book.rules.map((at) => rule(v, spine, at)).join(""), book.ink, 0.34, book.foil ? 0.95 : 0.8));
  if (book.entry) out.push(stampSvg(v, spine, book.ink));
  for (const label of book.labels) out.push(labelSvg(v, spine, label, book.ink));
  out.push(outline(v, solid));
  return out.join("");
}

function wavy(v: View, from: number, to: number, place: (x: number) => Point3) {
  const step = 18;
  const points: Point3[] = [];
  for (let x = from; x < to; x += step) points.push(place(x));
  points.push(place(to));
  return path(v, points);
}

function visibleX(v: View): [number, number] {
  return [v.s + (-v.ox - 40) / v.k, v.s + (v.width - v.ox + 40) / v.k];
}

function boardSvg(v: View, shelf: Shelf) {
  const T = BOARD_T;
  const D = BOARD_D;
  const section: Section = [
    [0, 0],
    [0, -T],
    [D - 2, -T],
    [D, -T + 2],
    [D, -BEVEL],
    [D - BEVEL, 0],
  ];
  const solid = prism(section, (y, z, x) => [x, y, z], shelf.left, shelf.right);
  const out: string[] = [];
  solid.sides.forEach((side) => side.vis && out.push(fill(v, side.pts, WOOD, side.n)));
  const [lo, hi] = visibleX(v);
  const from = Math.max(shelf.left, lo);
  const to = Math.min(shelf.right, hi);
  if (to > from) {
    const front = [-6.5, -9.8, -13.6, -16.9].map((z, index) => wavy(v, from, to, (x) => [x, D, z + 0.55 * Math.sin(x / 170 + index * 1.7) + 0.3 * Math.sin(x / 47 + index)]));
    out.push(stroke(front.join(""), "#6b4724", 0.22, 0.35));
    const top = [D - 9, D - 23, D - 41, D - 64, D - 92, D - 125].map((y, index) => wavy(v, from, to, (x) => [x, y + 1.2 * Math.sin(x / 210 + index * 2.3), 0]));
    out.push(stroke(top.join(""), "#7a5430", 0.2, 0.22));
  }
  out.push(outline(v, solid));
  return out.join("");
}

function screwSvg(v: View, x: number, y: number, z: number) {
  const r = 2.2;
  const ring = Array.from({ length: 16 }, (_, step): Point3 => [x + r * Math.cos((step / 16) * Math.PI * 2), y, z + r * Math.sin((step / 16) * Math.PI * 2)]);
  return fill(v, ring, "#6a635b", [0, 1, 0]) + `<path class="sh-edge sh-thin" d="${path(v, ring, true)}"/>` + stroke(path(v, [[x - r * 0.92, y, z + r * 0.4], [x + r * 0.92, y, z - r * 0.4]]), "#1c1714", 0.5, 0.85);
}

function bracketSvg(v: View, x: number) {
  const T = BOARD_T;
  const plate = box(x - 11, x + 11, 0, 3, -T - 150, -T);
  const gusset = prism(
    [
      [3, -T],
      [178, -T],
      [3, -T - 128],
    ],
    (y, z, s) => [s, y, z],
    x - 3,
    x + 3
  );
  return (
    solidSvg(v, plate, IRON) +
    screwSvg(v, x - 7, 3.01, -T - 104) +
    screwSvg(v, x + 7, 3.01, -T - 104) +
    screwSvg(v, x, 3.01, -T - 140) +
    solidSvg(v, gusset, IRON)
  );
}

function stoneSvg(v: View, shelf: Shelf) {
  const { x0, x1 } = shelf.stone;
  const solid = prism(
    [
      [22, 0],
      [148, 0],
      [148, 128],
      [22, 150],
    ],
    (y, z, x) => [x, y, z],
    x0,
    x1
  );
  const out = [solidSvg(v, solid, STONE)];
  const r = Math.abs(Math.sin(x0 * 12.9898) * 43758.5453);
  const specks = Array.from({ length: 22 }, (_, index) => {
    const a = (Math.sin(index * 78.233 + r) * 0.5 + 0.5) * (x1 - x0 - 4) + x0 + 2;
    const b = (Math.sin(index * 12.345 + r * 0.7) * 0.5 + 0.5) * 118 + 6;
    const radius = 0.35 + (index % 3) * 0.22;
    return [a, b, radius, index % 2] as const;
  });
  for (const [a, b, radius, dark] of specks) {
    const ring = Array.from({ length: 8 }, (_, step): Point3 => [a + radius * Math.cos((step / 8) * Math.PI * 2), 148, b + radius * Math.sin((step / 8) * Math.PI * 2)]);
    out.push(flat(v, ring, dark ? "#5d5952" : "#cfcac0", 0.8));
  }
  out.push(fill(v, [[x0, 148, 0], [x1, 148, 0], [x1, 148, 2], [x0, 148, 2]], "#3d4a3c", [0, 1, 0]));
  return out.join("");
}

function ironSvg(v: View, shelf: Shelf) {
  const c = shelf.iron.x;
  const foot = box(c, c + 62, 18, 138, 0, 3);
  const plate = box(c, c + 3, 18, 138, 0, 160);
  const gusset = prism(
    [
      [c + 3, 0],
      [c + 50, 0],
      [c + 3, 118],
    ],
    (x, z, y) => [x, y, z],
    74,
    80
  );
  const rivets = [[c + 44, 34], [c + 44, 122]].map(([x, y]) => {
    const ring = Array.from({ length: 10 }, (_, step): Point3 => [x! + 1.6 * Math.cos((step / 10) * Math.PI * 2), y! + 1.6 * Math.sin((step / 10) * Math.PI * 2), 3.01]);
    return fill(v, ring, "#6a635b", [0, 0, 1]) + `<path class="sh-edge sh-thin" d="${path(v, ring, true)}"/>`;
  });
  return solidSvg(v, foot, IRON) + rivets.join("") + solidSvg(v, plate, IRON) + solidSvg(v, gusset, IRON);
}

function haloSvg(v: View, points: Point3[], opacity: number) {
  return `<path class="iso-halo sh-halo" style="opacity:${n(opacity)}" d="${path(v, points, true)}"/>`;
}

const WEAVE = 1.4;

export function renderScene(v: View, shelf: Shelf, frame: Frame) {
  const out: string[] = [];
  const shift = -v.s * v.k + v.ox;
  out.push(
    `<defs><pattern id="sh-weave" patternUnits="userSpaceOnUse" width="${WEAVE}" height="${WEAVE}" patternTransform="translate(${n(shift % WEAVE)} 0)"><path d="M0 ${WEAVE / 2}H${WEAVE}M${WEAVE / 2} 0V${WEAVE}" stroke="#ffffff" stroke-opacity="0.045" stroke-width="0.45"/></pattern></defs>`
  );
  const [lo, hi] = visibleX(v);
  const T = BOARD_T;
  out.push(haloSvg(v, [[shelf.left + 4, 0.5, -T - 4], [shelf.right - 4, 0.5, -T - 4], [shelf.right - 4, 0.5, -T - 34], [shelf.left + 4, 0.5, -T - 34]], 0.55));
  for (const bracket of shelf.brackets) if (bracket.x > lo - 60 && bracket.x < hi + 60) out.push(bracketSvg(v, bracket.x));
  out.push(boardSvg(v, shelf));
  const feet = shelf.books
    .filter((book) => book.z === 0 && rightOf(book) > lo - 30 && leftOf(book) < hi + 30)
    .map((book) => {
      const x0 = book.x;
      const x1 = book.pose === "flat" ? book.x + book.h : rightOf(book);
      return path(v, [[x0 - 1.5, book.back, 0.2], [x1 + 1.5, book.back, 0.2], [x1 + 2.5, book.back + book.d + 9, 0.2], [x0 - 1, book.back + book.d + 9, 0.2]], true);
    });
  if (feet.length) out.push(`<path class="iso-halo sh-halo" style="opacity:0.5" d="${feet.join("")}"/>`);
  if (shelf.stone.x1 > lo && shelf.stone.x0 < hi) out.push(stoneSvg(v, shelf));
  const order = shelf.books.map((book, index) => ({ book, index })).sort((a, b) => a.book.slot - b.book.slot || a.book.z - b.book.z);
  const crowns = new Set<number>();
  const tops = new Map<number, Book>();
  for (const { book } of order) if (book.pose === "flat") tops.set(book.slot, book);
  for (const book of tops.values()) crowns.add(book.index);
  for (const { book, index } of order) {
    const theta = book.pose === "up" ? frame.tilt[index] ?? book.lean : 0;
    const reach = book.pose === "up" ? book.h * Math.abs(Math.sin(theta)) + 4 : 4;
    if (rightOf(book) + reach < lo || leftOf(book) - reach > hi) continue;
    out.push(bookSvg(v, book, theta, crowns.has(book.index)));
  }
  if (shelf.iron.x < hi && shelf.iron.x + 62 > lo) out.push(ironSvg(v, shelf));
  return out.join("");
}

export function lift(v: View, frame: Frame): View {
  return { ...v, s: frame.s, oy: v.oy - frame.lift * DROP };
}

export function screenX(v: View, x: number) {
  return v.ox + (x - v.s) * CAM.sinA * v.k;
}
