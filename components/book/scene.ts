import { depthOf, fitProjection, haloOf, pathOf, type Flat, type Point3, type Projection } from "../iso/iso-kit";
import {
  BOARD,
  BOARD_SECTION,
  COVER_H,
  COVER_W,
  HEADBAND,
  LEAF_GAP,
  OPEN_EXTENT,
  PAGE_W,
  RIBBON_PATH,
  RIBBON_WIDTH,
  SEG,
  SEGMENTS,
  SPINE_BANDS,
  TAIL,
  TOP,
  boardPoint,
  dot,
  headOf,
  leafShape,
  shadeOf,
  spineCurve,
  vectorOf,
  type LeafShape,
  type XZ,
} from "./geometry";
import { curlOf, progressOf, smoothstep, type Flap, type Frame } from "./model";
import { coverArt, DOG_EAR_LEAF, leafArt, pastedownArt, type At, type FaceArt, type Library, type Mark } from "./pages";

export interface Stage {
  width: number;
  height: number;
}

export interface Camera {
  P: Projection;
  view: Point3;
  k: number;
  lift: number;
}

const START = { azimuth: 110, elevation: 50 };
const FINISH = { azimuth: 90, elevation: 90 };
const CLOSED_CENTRE: Point3 = [COVER_W / 2, 0, 10];
const OPEN_CENTRE: Point3 = [0, 0, 9];
const PAGE_CENTRE: Point3 = [PAGE_W / 2, 0, TOP];
const OVERRUN = 1.3;
const PORTRAIT_GROWTH = 1.4;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mix3 = (a: Point3, b: Point3, t: number): Point3 => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];

export function baseScale(stage: Stage) {
  const pad = Math.max(16, Math.min(stage.width, stage.height) * 0.07);
  const fit = fitProjection(OPEN_EXTENT, stage.width, stage.height, { pad, ...START }).scale;
  return stage.width / stage.height < 0.8 ? fit * PORTRAIT_GROWTH : fit;
}

export function finalZoom(stage: Stage, scale: number) {
  const unit = vectorOf([1, 0, 0], { origin: [0, 0], scale: 1, ...FINISH })[0];
  return Math.max((stage.width * OVERRUN) / (PAGE_W * unit * scale), (stage.height * OVERRUN) / (180 * unit * scale));
}

export function cameraAt(frame: Frame, stage: Stage, scale: number): Camera {
  const turn = smoothstep(0, 1, frame.push);
  const azimuth = mix(START.azimuth, FINISH.azimuth, turn);
  const elevation = mix(START.elevation, FINISH.elevation, turn);
  const end = finalZoom(stage, scale);
  const zoom = 1 / (1 - (1 - 1 / end) * frame.approach);
  const centre = mix3(mix3(CLOSED_CENTRE, OPEN_CENTRE, frame.centre), PAGE_CENTRE, smoothstep(0, 0.7, frame.push));
  const unit: Projection = { origin: [0, 0], scale: scale * zoom, azimuth, elevation };
  const lift = frame.lift * 16;
  const at = vectorOf([centre[0], centre[1], centre[2]], unit);
  const P: Projection = { ...unit, origin: [stage.width / 2 - at[0], stage.height / 2 - at[1]] };
  const view: Point3 = [Math.cos((azimuth * Math.PI) / 180) * Math.cos((elevation * Math.PI) / 180), Math.sin((azimuth * Math.PI) / 180) * Math.cos((elevation * Math.PI) / 180), Math.sin((elevation * Math.PI) / 180)];
  const k = Math.hypot(...vectorOf([1, 0, 0], unit));
  return { P, view, k: Math.max(k, Math.hypot(...vectorOf([0, 1, 0], unit))), lift };
}

const n = (value: number) => {
  const text = (Math.round(value * 100) / 100).toString();
  return text === "-0" ? "0" : text;
};

const at3 = (cam: Camera, point: Point3): Flat => {
  const [x, y] = vectorOf([point[0], point[1], point[2] + cam.lift], cam.P);
  return [x + cam.P.origin[0], y + cam.P.origin[1]];
};

const pathOf3 = (cam: Camera, points: Point3[], closed = false) => pathOf(points.map((point) => at3(cam, point)), closed);

const fillOf = (cam: Camera, points: Point3[], material: string, normal: Point3) =>
  `<path class="bk-f" data-m="${material}" style="--s:${n(shadeOf(normal))}" d="${pathOf3(cam, points, true)}"/>`;

interface Face {
  pts: Point3[];
  normal: Point3;
  material: string;
  group: number;
  key?: number;
  extra?: (cam: Camera) => string;
}

function sectionArea(section: XZ[]) {
  let area = 0;
  section.forEach(([a, b], index) => {
    const [c, d] = section[(index + 1) % section.length]!;
    area += a * d - c * b;
  });
  return area / 2;
}

interface PrismOptions {
  axis: "y" | "z";
  material: string | ((index: number) => string);
  cap?: string;
  smooth?: (index: number) => number;
  skip?: (index: number) => boolean;
  caps?: [boolean, boolean];
}

function prism(raw: XZ[], s0: number, s1: number, options: PrismOptions): Face[] {
  const section = sectionArea(raw) < 0 ? [...raw].reverse() : raw;
  const reversed = section !== raw;
  const count = section.length;
  const toWorld = ([a, b]: XZ, s: number): Point3 => (options.axis === "y" ? [a, s, b] : [a, b, s]);
  const normalOf = (da: number, db: number): Point3 => {
    const length = Math.hypot(da, db) || 1;
    return options.axis === "y" ? [db / length, 0, -da / length] : [db / length, -da / length, 0];
  };
  const faces: Face[] = [];
  for (let index = 0; index < count; index++) {
    const original = reversed ? count - 2 - index : index;
    const key = (original + count) % count;
    if (options.skip?.(key)) continue;
    const a = section[index]!;
    const b = section[(index + 1) % count]!;
    const normal = normalOf(b[0] - a[0], b[1] - a[1]);
    const material = typeof options.material === "string" ? options.material : options.material(key);
    faces.push({ pts: [toWorld(a, s0), toWorld(b, s0), toWorld(b, s1), toWorld(a, s1)], normal, material, group: options.smooth?.(key) ?? 0, key });
  }
  const [low, high] = options.caps ?? [true, true];
  const capMaterial = options.cap ?? (typeof options.material === "string" ? options.material : options.material(0));
  const axis: Point3 = options.axis === "y" ? [0, 1, 0] : [0, 0, 1];
  if (low) faces.push({ pts: section.map((point) => toWorld(point, s0)), normal: [-axis[0], -axis[1], -axis[2]], material: capMaterial, group: 0 });
  if (high) faces.push({ pts: section.map((point) => toWorld(point, s1)), normal: axis, material: capMaterial, group: 0 });
  return faces;
}

const keyOf = (point: Point3) => `${point[0].toFixed(3)},${point[1].toFixed(3)},${point[2].toFixed(3)}`;

function solidSvg(cam: Camera, faces: Face[], edgeTone = "hi") {
  const visible = faces.map((face) => dot(face.normal, cam.view) > 1e-6);
  const out: string[] = [];
  faces.forEach((face, index) => {
    if (!visible[index]) return;
    out.push(fillOf(cam, face.pts, face.material, face.normal));
    if (face.extra) out.push(face.extra(cam));
  });
  const edges = new Map<string, { a: Point3; b: Point3; faces: number[] }>();
  faces.forEach((face, index) => {
    face.pts.forEach((a, at) => {
      const b = face.pts[(at + 1) % face.pts.length]!;
      const ka = keyOf(a);
      const kb = keyOf(b);
      const key = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
      const edge = edges.get(key);
      if (edge) edge.faces.push(index);
      else edges.set(key, { a, b, faces: [index] });
    });
  });
  const outline: string[] = [];
  const crease: string[] = [];
  for (const { a, b, faces: owners } of edges.values()) {
    const seen = owners.filter((owner) => visible[owner]);
    if (!seen.length) continue;
    if (owners.length === 1 || seen.length === 1) outline.push(pathOf3(cam, [a, b]));
    else if (owners.length === 2 && dot(faces[owners[0]!]!.normal, faces[owners[1]!]!.normal) < 0.94 && (faces[owners[0]!]!.group === 0 || faces[owners[0]!]!.group !== faces[owners[1]!]!.group)) crease.push(pathOf3(cam, [a, b]));
  }
  if (crease.length) out.push(`<path class="iso-line" data-tone="faint" d="${crease.join("")}"/>`);
  if (outline.length) out.push(`<path class="iso-line bk-edge" data-tone="${edgeTone}" d="${outline.join("")}"/>`);
  return out.join("");
}

interface FaceMap {
  point: (rx: number, ry: number) => Point3;
  ex: Point3;
  ey: Point3;
}

const INK_CLASS = "bk-l";

function textSvg(cam: Camera, map: FaceMap, mark: Extract<Mark, { kind: "text" }>) {
  const o = at3(cam, map.point(mark.x, mark.y));
  const a = vectorOf(map.ex, cam.P);
  const b = vectorOf(map.ey, cam.P);
  const spacing = mark.spacing ? ` letter-spacing="${n(mark.spacing)}"` : "";
  const text = mark.text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  return `<text class="bk-t" data-font="${mark.font}" data-ink="${mark.ink}" font-size="${n(mark.size)}"${spacing} transform="matrix(${n(a[0])} ${n(a[1])} ${n(b[0])} ${n(b[1])} ${n(o[0])} ${n(o[1])})">${text}</text>`;
}

function artSvg(cam: Camera, map: FaceMap, marks: Mark[], shade: number) {
  const lines = new Map<string, string[]>();
  const out: string[] = [];
  for (const mark of marks) {
    if (mark.kind === "line") {
      const key = `${mark.ink}${mark.free ? "|free" : ""}`;
      const list = lines.get(key) ?? [];
      list.push(pathOf3(cam, mark.pts.map(([x, y]) => map.point(x, y)), mark.closed));
      lines.set(key, list);
    } else if (mark.kind === "poly") {
      out.push(`<path class="bk-p" data-ink="${mark.ink}" style="--s:${n(shade)}" d="${pathOf3(cam, mark.pts.map(([x, y]) => map.point(x, y)), true)}"/>`);
    } else if (mark.kind === "dots") {
      const r = Math.max(0.35, mark.r * cam.k);
      const d = mark.pts
        .map(([x, y]) => {
          const [sx, sy] = at3(cam, map.point(x, y));
          return `M${n(sx - r)} ${n(sy)}a${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0`;
        })
        .join("");
      out.push(`<path class="bk-d" data-ink="${mark.ink}" d="${d}"/>`);
    } else {
      out.push(textSvg(cam, map, mark));
    }
  }
  const strokes: string[] = [];
  for (const [key, list] of lines) {
    const [ink, free] = key.split("|");
    strokes.push(`<path class="${INK_CLASS}" data-ink="${ink}"${free ? ' data-free=""' : ""} d="${list.join("")}"/>`);
  }
  return strokes.join("") + out.join("");
}

function flatMap(origin: Point3, ex: Point3, ey: Point3): FaceMap {
  return {
    point: (rx, ry) => [origin[0] + ex[0] * rx + ey[0] * ry, origin[1] + ex[1] * rx + ey[1] * ry, origin[2] + ex[2] * rx + ey[2] * ry],
    ex,
    ey,
  };
}

export interface SideArt {
  bins: Mark[][];
  lines: Mark[];
}

export interface BookArt {
  cover: FaceArt;
  pastedown: FaceArt;
  leaves: [SideArt, SideArt][];
}

function clipStrip(points: At[], lo: number, hi: number, toU: (rx: number) => number): At[] {
  const clip = (input: At[], keep: (u: number) => boolean, edge: number) => {
    const result: At[] = [];
    input.forEach((current, index) => {
      const previous = input[(index + input.length - 1) % input.length]!;
      const uc = toU(current[0]);
      const up = toU(previous[0]);
      const cross = (): At => {
        const t = (edge - up) / (uc - up);
        return [previous[0] + (current[0] - previous[0]) * t, previous[1] + (current[1] - previous[1]) * t];
      };
      if (keep(uc)) {
        if (!keep(up)) result.push(cross());
        result.push(current);
      } else if (keep(up)) {
        result.push(cross());
      }
    });
    return result;
  };
  return clip(clip(points, (u) => u >= lo - 1e-9, lo), (u) => u <= hi + 1e-9, hi);
}

function splitArt(art: FaceArt, verso: boolean): SideArt {
  const toU = (rx: number) => (verso ? PAGE_W - rx : rx);
  const bins: Mark[][] = Array.from({ length: SEGMENTS }, () => []);
  const lines: Mark[] = [];
  const binOf = (u: number) => Math.min(SEGMENTS - 1, Math.max(0, Math.floor(u / SEG)));
  for (const mark of art.marks) {
    if (mark.kind === "text") {
      bins[binOf(toU(mark.x + mark.size * 0.25 * mark.text.length))]!.push(mark);
    } else if (mark.kind === "dots") {
      const groups = new Map<number, At[]>();
      for (const point of mark.pts) {
        const bin = binOf(toU(point[0]));
        groups.set(bin, [...(groups.get(bin) ?? []), point]);
      }
      for (const [bin, pts] of groups) bins[bin]!.push({ ...mark, pts });
    } else if (mark.kind === "poly") {
      for (let bin = 0; bin < SEGMENTS; bin++) {
        const pts = clipStrip(mark.pts, bin * SEG, (bin + 1) * SEG, toU);
        if (pts.length >= 3) bins[bin]!.push({ ...mark, pts });
      }
    } else {
      const pieces = new Map<number, At[][]>();
      for (let index = 0; index + 1 < mark.pts.length; index++) {
        const a = mark.pts[index]!;
        const b = mark.pts[index + 1]!;
        const ua = toU(a[0]);
        const ub = toU(b[0]);
        const cuts = [0, 1];
        const lo = Math.min(ua, ub);
        const hi = Math.max(ua, ub);
        for (let edge = Math.ceil(lo / SEG) * SEG; edge < hi; edge += SEG) {
          if (edge > lo) cuts.push((edge - ua) / (ub - ua));
        }
        cuts.sort((p, q) => p - q);
        for (let c = 0; c + 1 < cuts.length; c++) {
          const t0 = cuts[c]!;
          const t1 = cuts[c + 1]!;
          if (t1 - t0 < 1e-9) continue;
          const p0: At = [a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0];
          const p1: At = [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1];
          const bin = binOf(toU((p0[0] + p1[0]) / 2));
          const list = pieces.get(bin) ?? [];
          const last = list[list.length - 1];
          const tail = last?.[last.length - 1];
          if (last && tail && Math.abs(tail[0] - p0[0]) < 1e-9 && Math.abs(tail[1] - p0[1]) < 1e-9) last.push(p1);
          else list.push([p0, p1]);
          pieces.set(bin, list);
        }
      }
      for (const [bin, list] of pieces) for (const pts of list) bins[bin]!.push({ kind: "line", ink: mark.ink, pts, free: mark.free });
      const joined: At[] = [];
      for (const [, list] of [...pieces].sort((p, q) => (verso ? q[0] - p[0] : p[0] - q[0]))) {
        for (const pts of list) for (const point of pts) {
          const tail = joined[joined.length - 1];
          if (!tail || Math.abs(tail[0] - point[0]) > 1e-9 || Math.abs(tail[1] - point[1]) > 1e-9) joined.push(point);
        }
      }
      if (joined.length > 1 && isMonotone(mark.pts)) lines.push({ kind: "line", ink: mark.ink, pts: joined, free: mark.free, closed: mark.closed });
      else for (const [, list] of pieces) for (const pts of list) lines.push({ kind: "line", ink: mark.ink, pts, free: mark.free });
    }
  }
  return { bins, lines };
}

function isMonotone(points: At[]) {
  let sign = 0;
  for (let index = 1; index < points.length; index++) {
    const step = Math.sign(points[index]![0] - points[index - 1]![0]);
    if (!step) continue;
    if (sign && step !== sign) return false;
    sign = step;
  }
  return true;
}

export function buildArt(lib: Library, count: number): BookArt {
  const leaves = Array.from({ length: count }, (_, index) => {
    const [recto, verso] = leafArt(lib, index);
    return [splitArt(recto, false), splitArt(verso, true)] as [SideArt, SideArt];
  });
  return { cover: coverArt(lib), pastedown: pastedownArt(lib), leaves };
}

function boardFaces(theta: number, art: BookArt): Face[] {
  const section = BOARD_SECTION.map(([u, w]) => boardPoint(theta, u, w));
  const along: Point3 = [Math.cos(theta), 0, Math.sin(theta)];
  const faces = prism(section, -COVER_H / 2, COVER_H / 2, {
    axis: "y",
    material: (index) => (index === 0 ? "endpaper" : "cloth"),
    cap: "cloth",
    skip: (index) => index === 4,
  });
  const inner = faces.find((face) => face.key === 0);
  if (inner) {
    const [x, z] = boardPoint(theta, COVER_W, 0);
    const map = flatMap([x, -COVER_H / 2, z], [-along[0], 0, -along[2]], [0, 1, 0]);
    inner.extra = (cam) => artSvg(cam, map, art.pastedown.marks, shadeOf(inner.normal));
  }
  const outer = faces.find((face) => face.key === 3);
  if (outer) {
    const [x, z] = boardPoint(theta, 0, BOARD);
    const map = flatMap([x, -COVER_H / 2, z], along, [0, 1, 0]);
    outer.extra = (cam) => artSvg(cam, map, art.cover.marks, shadeOf(outer.normal));
  }
  return faces;
}

function spineSvg(cam: Camera, theta: number, lib: Library) {
  const curve = spineCurve(theta, 18);
  const faces = prism([...curve], -COVER_H / 2, COVER_H / 2, {
    axis: "y",
    material: "cloth",
    smooth: (index) => (index < curve.length - 1 ? 1 : 0),
  });
  const out = [solidSvg(cam, faces, "hi")];
  const outer = spineCurve(theta, 18, 0.75);
  for (const y of SPINE_BANDS) {
    const section: XZ[] = [...outer, ...[...curve].reverse()];
    const band = prism(section, y - 1.7, y + 1.7, {
      axis: "y",
      material: "cloth",
      smooth: (index) => (index < outer.length - 1 ? 2 : 0),
    });
    out.push(solidSvg(cam, band, "hi"));
  }
  let best = 0;
  curve.forEach((point, index) => {
    if (point[0] < curve[best]![0]) best = index;
  });
  const top = curve[Math.min(curve.length - 1, best + 1)]!;
  const bottom = curve[Math.max(0, best - 1)]!;
  const tx = top[0] - bottom[0];
  const tz = top[1] - bottom[1];
  const length = Math.hypot(tx, tz) || 1;
  const normal: Point3 = [-tz / length, 0, tx / length];
  if (dot(normal, cam.view) > 0.05) {
    const [x, z] = curve[best]!;
    const lift = 0.05;
    const map = flatMap([x + normal[0] * lift, 0, z + normal[2] * lift], [0, 1, 0], [-tx / length, 0, -tz / length]);
    const title = "ARTICLES WORTH READING";
    const width = lib.measure(title, "mono", 2.7, 0.55);
    out.push(
      artSvg(
        cam,
        map,
        [
          { kind: "text", ink: "foil", x: -width / 2, y: 1, size: 2.7, font: "mono", text: title, spacing: 0.55 },
          { kind: "text", ink: "foil", x: 74, y: 1, size: 2.9, font: "display", text: "MH" },
        ],
        0,
      ),
    );
  }
  return out.join("");
}

function blockSvg(cam: Camera) {
  const section: XZ[] = [
    [0, BOARD],
    [PAGE_W, BOARD],
    [PAGE_W, TOP],
    [0, TOP],
  ];
  const faces = prism(section, -90, TAIL, { axis: "y", material: (index) => (index === 2 ? "paper" : "edge"), cap: "edge" });
  const tail = faces[faces.length - 1]!;
  tail.material = "edge";
  tail.extra = (target) => {
    const lines: string[] = [];
    for (let row = 1; row < 12; row++) {
      const z = BOARD + (BLOCK_LINES[row] ?? row / 12) * (TOP - BOARD);
      lines.push(pathOf3(target, [[0, TAIL, z], [PAGE_W, TAIL, z]]));
    }
    return `<path class="${INK_CLASS}" data-ink="edgeline" d="${lines.join("")}"/>`;
  };
  return solidSvg(cam, faces, "mid");
}

const BLOCK_LINES = [0, 0.07, 0.16, 0.24, 0.31, 0.41, 0.49, 0.57, 0.66, 0.74, 0.83, 0.92];

function backBoardSvg(cam: Camera) {
  const section: XZ[] = [
    [0, 0],
    [COVER_W, 0],
    [COVER_W, BOARD - 0.6],
    [COVER_W - 0.6, BOARD],
    [0, BOARD],
  ];
  return solidSvg(cam, prism(section, -COVER_H / 2, COVER_H / 2, { axis: "y", material: "cloth" }), "hi");
}

function headbandSvg(cam: Camera) {
  const { x, y, r, z0, z1, wraps } = HEADBAND;
  const ring: XZ[] = Array.from({ length: 14 }, (_, index) => {
    const angle = (index / 14) * Math.PI * 2;
    return [x + r * Math.cos(angle), y + r * Math.sin(angle)];
  });
  const out: string[] = [];
  const step = (z1 - z0) / wraps;
  for (let index = 0; index < wraps; index++) {
    const faces = prism(ring, z0 + index * step, z0 + (index + 1) * step, {
      axis: "z",
      material: index % 2 ? "bandA" : "bandB",
      smooth: () => 3,
      caps: [false, index === wraps - 1],
    });
    out.push(solidSvg(cam, faces, "mid"));
  }
  return out.join("");
}

function ribbonSvg(cam: Camera) {
  const pts = RIBBON_PATH;
  const half = RIBBON_WIDTH / 2;
  const sides = pts.map((point, index) => {
    const a = pts[Math.max(0, index - 1)]!;
    const b = pts[Math.min(pts.length - 1, index + 1)]!;
    const flat = point[2] < 0.2;
    let wx = 1;
    let wy = 0;
    if (flat) {
      const dx = b[0] - a[0];
      const dy = b[1] - a[1];
      const length = Math.hypot(dx, dy) || 1;
      wx = dy / length;
      wy = -dx / length;
    }
    return [
      [point[0] - wx * half, point[1] - wy * half, point[2]],
      [point[0] + wx * half, point[1] + wy * half, point[2]],
    ] as [Point3, Point3];
  });
  const units: { depth: number; svg: string }[] = [];
  for (let index = 0; index + 1 < pts.length; index++) {
    const [a0, a1] = sides[index]!;
    const [b0, b1] = sides[index + 1]!;
    const last = index + 2 === pts.length;
    const tip = pts[index + 1]!;
    const back = pts[index]!;
    const notch: Point3 = [tip[0] + (back[0] - tip[0]) * 0.35, tip[1] + (back[1] - tip[1]) * 0.35, tip[2]];
    const quad = last ? [a0, a1, b1, notch, b0] : [a0, a1, b1, b0];
    const u: Point3 = [a1[0] - a0[0], a1[1] - a0[1], a1[2] - a0[2]];
    const v: Point3 = [b0[0] - a0[0], b0[1] - a0[1], b0[2] - a0[2]];
    let normal: Point3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const length = Math.hypot(...normal) || 1;
    normal = [normal[0] / length, normal[1] / length, normal[2] / length];
    if (dot(normal, cam.view) < 0) normal = [-normal[0], -normal[1], -normal[2]];
    const edges = [pathOf3(cam, [a0, b0]), pathOf3(cam, [a1, b1])];
    if (index === 0) edges.push(pathOf3(cam, [a0, a1]));
    if (last) edges.push(pathOf3(cam, [b0, notch, b1]));
    units.push({
      depth: depthOf([(a0[0] + b1[0]) / 2, (a0[1] + b1[1]) / 2, (a0[2] + b1[2]) / 2], cam.P),
      svg: `${fillOf(cam, quad, "ribbon", normal)}<path class="iso-line bk-ribbon-edge" d="${edges.join("")}"/>`,
    });
  }
  units.sort((p, q) => p.depth - q.depth);
  return `<g class="bk-ribbon">${units.map((unit) => unit.svg).join("")}</g>`;
}

function leafMap(shape: LeafShape, front: boolean, k: number): FaceMap {
  const angle = shape.angles[k]!;
  const ex: Point3 = front ? [Math.cos(angle), 0, Math.sin(angle)] : [-Math.cos(angle), 0, -Math.sin(angle)];
  return {
    point: (rx, ry) => {
      const u = front ? rx : PAGE_W - rx;
      const at = Math.min(SEGMENTS - 1, Math.max(0, k < 0 ? Math.floor(u / SEG) : k));
      const t = (u - at * SEG) / SEG;
      return [shape.xs[at]! + (shape.xs[at + 1]! - shape.xs[at]!) * t, ry - 90, shape.zs[at]! + (shape.zs[at + 1]! - shape.zs[at]!) * t];
    },
    ex,
    ey: [0, 1, 0],
  };
}

function leafSvg(cam: Camera, shape: LeafShape, art: [SideArt, SideArt] | null, dogEar: boolean, material: string) {
  const units: { depth: number; fill: string; marks: string; edges: string }[] = [];
  const sides: boolean[] = [];
  for (let k = 0; k < SEGMENTS; k++) {
    const angle = shape.angles[k]!;
    const recto: Point3 = [-Math.sin(angle), 0, Math.cos(angle)];
    const front = dot(recto, cam.view) >= 0;
    sides.push(front);
  }
  const folded = sides.some((side) => side !== sides[0]);
  for (let k = 0; k < SEGMENTS; k++) {
    const angle = shape.angles[k]!;
    const front = sides[k]!;
    const recto: Point3 = [-Math.sin(angle), 0, Math.cos(angle)];
    const normal: Point3 = front ? recto : [-recto[0], 0, -recto[2]];
    const u0 = k * SEG;
    const u1 = (k + 1) * SEG;
    const h0 = headOf(dogEar, u0);
    const h1 = headOf(dogEar, u1);
    const p00: Point3 = [shape.xs[k]!, h0, shape.zs[k]!];
    const p10: Point3 = [shape.xs[k + 1]!, h1, shape.zs[k + 1]!];
    const p11: Point3 = [shape.xs[k + 1]!, TAIL, shape.zs[k + 1]!];
    const p01: Point3 = [shape.xs[k]!, TAIL, shape.zs[k]!];
    const fill = fillOf(cam, [p00, p10, p11, p01], material, normal);
    const side = art?.[front ? 0 : 1];
    const binned = side?.bins[k]?.filter((mark) => folded || mark.kind !== "line") ?? [];
    const marks = binned.length ? artSvg(cam, leafMap(shape, front, k), binned, shadeOf(normal)) : "";
    const edges = [pathOf3(cam, [p00, p10]), pathOf3(cam, [p01, p11])];
    if (k === SEGMENTS - 1) edges.push(pathOf3(cam, [p10, p11]));
    units.push({ depth: depthOf([(p00[0] + p11[0]) / 2, 0, (p00[2] + p11[2]) / 2], cam.P), fill, marks, edges: edges.join("") });
  }
  units.sort((p, q) => p.depth - q.depth);
  const folds: string[] = [];
  for (let k = 1; k < SEGMENTS; k++) {
    if (sides[k] !== sides[k - 1]) folds.push(pathOf3(cam, [[shape.xs[k]!, headOf(dogEar, k * SEG), shape.zs[k]!], [shape.xs[k]!, TAIL, shape.zs[k]!]]));
  }
  const fold = folds.length ? `<path class="iso-line bk-leaf-edge" d="${folds.join("")}"/>` : "";
  if (folded) return units.map((unit) => `${unit.fill}${unit.marks}<path class="iso-line bk-leaf-edge" d="${unit.edges}"/>`).join("") + fold;
  const front = sides[0]!;
  const side = art?.[front ? 0 : 1];
  const angle = shape.angles[0]!;
  const normal: Point3 = front ? [-Math.sin(angle), 0, Math.cos(angle)] : [Math.sin(angle), 0, -Math.cos(angle)];
  const lines = side?.lines.length ? artSvg(cam, leafMap(shape, front, -1), side.lines, shadeOf(normal)) : "";
  return (
    units.map((unit) => unit.fill).join("") +
    lines +
    units.map((unit) => unit.marks).join("") +
    `<path class="iso-line bk-leaf-edge" d="${units.map((unit) => unit.edges).join("")}"/>`
  );
}

function shapeOf(item: Flap, index: number) {
  const p = progressOf(item);
  const rise = ((LEAF_GAP * (index + 1)) / 3) * smoothstep(0.55, 1, p);
  return leafShape(item.at, curlOf(item), rise);
}

function angleFromGutter(x: number, z: number) {
  let angle = Math.atan2(z - TOP, x);
  if (angle < -Math.PI / 2) angle += Math.PI * 2;
  return angle;
}

export function renderScene(frame: Frame, cam: Camera, art: BookArt | null, lib: Library) {
  const out: string[] = [];
  const theta = frame.cover.at;
  const far = boardPoint(theta, COVER_W, 0)[0];
  const left = Math.min(-SPINE_REACH, far * smoothstep(0.8, 1, theta / Math.PI));
  const halo = haloOf({ x: left, y: -COVER_H / 2, w: COVER_W - left, d: COVER_H, r: 4 }, 0, 0.4, cam.P);
  out.push(`<path class="iso-halo bk-halo" style="opacity:${n(0.32 * (1 - frame.lift) * frame.opacity)}" d="${halo}"/>`);
  out.push(backBoardSvg(cam));
  out.push(blockSvg(cam));
  out.push(headbandSvg(cam));
  out.push(ribbonSvg(cam));

  const psi = Math.atan2(cam.view[2], cam.view[0]);
  const fan: { key: number; order: number; left: boolean; svg: () => string }[] = [];
  const [bx, bz] = boardPoint(theta, COVER_W / 2, BOARD / 2);
  const boardAngle = angleFromGutter(bx, bz);
  fan.push({ key: -Math.abs(boardAngle - psi), order: -1, left: boardAngle > psi, svg: () => solidSvg(cam, boardFaces(theta, art ?? EMPTY_ART), "hi") });

  const leaves = frame.leaves;
  const topResting = leaves.findIndex((leaf) => leaf.phase === "rest");
  let topLanded = -1;
  leaves.forEach((leaf, index) => {
    if (leaf.phase === "landed") topLanded = index;
  });
  leaves.forEach((leaf, index) => {
    if (leaf.phase === "rest" && index !== topResting) return;
    const shape = shapeOf(leaf, index);
    const mid = SEGMENTS / 2;
    const angle = angleFromGutter(shape.xs[mid]!, shape.zs[mid]!);
    const key = -Math.abs(angle - psi);
    const showArt = leaf.phase !== "landed" || index === topLanded;
    fan.push({
      key,
      order: index,
      left: angle > psi,
      svg: () => leafSvg(cam, shape, showArt && art ? art.leaves[index]! : null, index === DOG_EAR_LEAF, index === 0 ? "endpaper" : "paper"),
    });
  });
  fan.sort((a, b) => {
    if (Math.abs(a.key - b.key) > 1e-6) return a.key - b.key;
    return a.order - b.order;
  });
  for (const item of fan) if (!item.left) out.push(item.svg());
  out.push(spineSvg(cam, theta, lib));
  for (const item of fan) if (item.left) out.push(item.svg());
  return out.join("");
}

const SPINE_REACH = 4;

const EMPTY_ART: BookArt = { cover: { marks: [] }, pastedown: { marks: [] }, leaves: [] };
