import type { Font, Measure } from "../intro/fonts";
import { spineTitle, surnames, type Entry } from "./titles";

export const BOARD_T = 22;
export const BOARD_D = 250;
export const BEVEL = 3;
export const AZIMUTH = 90;
export const ELEVATION = 12;
export const FALLBACK_COUNT = 28;
export const ACCENT = "var(--accent)";

export type Kind = "hard" | "trade" | "mass";
export type Finish = "cloth" | "jacket" | "paper";
export type Stamp = "dot" | "ring" | "bar" | "tri";

export interface Label {
  text: string;
  font: Font;
  size: number;
  spacing: number;
  u: number;
  v: number;
  along: "u" | "v";
  anchor: "middle" | "end";
  width: number;
}

export interface Band {
  colour: string;
  v0: number;
  v1: number;
}

export interface Book {
  index: number;
  entry: Entry | null;
  kind: Kind;
  finish: Finish;
  h: number;
  t: number;
  d: number;
  back: number;
  bulge: number;
  boardT: number;
  square: number;
  colour: string;
  ink: string;
  foil: boolean;
  band: Band | null;
  rules: number[];
  stamp: Stamp;
  worn: boolean;
  cracks: number[];
  gloss: boolean;
  pose: "up" | "flat";
  x: number;
  z: number;
  lean: number;
  lo: number;
  hi: number;
  accent: boolean;
  slot: number;
  labels: Label[];
}

export interface Bracket {
  x: number;
}

export interface Shelf {
  books: Book[];
  left: number;
  right: number;
  rowLeft: number;
  rowRight: number;
  lastRight: number;
  stone: { x0: number; x1: number };
  iron: { x: number };
  brackets: Bracket[];
  tallest: number;
  titled: boolean;
}

const PALETTE: [string, boolean][] = [
  ["#6b2f2a", true],
  ["#97503c", true],
  ["#b98058", false],
  ["#c3a15e", false],
  ["#6c6a40", true],
  ["#94a086", false],
  ["#34463a", true],
  ["#4e6763", true],
  ["#4a4d53", true],
  ["#2e2a27", true],
  ["#5a3b45", true],
  ["#c29a8e", false],
  ["#e4d9c2", false],
  ["#cbb995", false],
  ["#a59e92", false],
  ["#86593b", true],
];

const LIGHT_INK = "#f2eadb";
const FOIL_INK = "#e3d09c";
const DARK_INK = "#2a2420";

export function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function random(seed: number) {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const keyOf = (entry: Entry | null, index: number) => (entry ? `${entry.title}|${entry.author}`.toLowerCase() : `untitled-${index}`);

function makeBook(entry: Entry | null, index: number): Book {
  const r = random(hash(keyOf(entry, index)));
  const roll = r();
  const kind: Kind = roll < 0.46 ? "hard" : roll < 0.86 ? "trade" : "mass";
  const [colour, dark] = PALETTE[Math.floor(r() * PALETTE.length)]!;
  let h: number;
  let t: number;
  let d: number;
  let finish: Finish;
  if (kind === "hard") {
    h = 214 + r() * 32;
    t = r() < 0.16 ? 44 + r() * 10 : 22 + r() * 18;
    d = 148 + r() * 16;
    finish = r() < 0.55 ? "cloth" : "jacket";
  } else if (kind === "trade") {
    h = 196 + r() * 20;
    t = 15 + r() * 19;
    d = 130 + r() * 8;
    finish = "paper";
  } else {
    h = 172 + r() * 6;
    t = 18 + r() * 13;
    d = 106 + r() * 4;
    finish = "paper";
  }
  const rounded = kind === "hard" && t <= 40 && (finish === "cloth" || r() < 0.5);
  const foil = finish === "cloth";
  const ink = dark ? (foil ? FOIL_INK : LIGHT_INK) : DARK_INK;
  let band: Band | null = null;
  if (finish !== "cloth" && r() < 0.62) {
    const [other] = PALETTE[(PALETTE.findIndex(([c]) => c === colour) + 3 + Math.floor(r() * 9)) % PALETTE.length]!;
    const top = r() < 0.5;
    const span = 18 + r() * 26;
    band = top ? { colour: other, v0: 0, v1: span } : { colour: other, v0: h - span, v1: h };
  }
  const rules = foil ? [11, 13.2, h - 13.2, h - 11] : r() < 0.4 ? [band && band.v0 === 0 ? band.v1 + 3 : 9, h - 9] : [];
  const stamps: Stamp[] = ["dot", "ring", "bar", "tri"];
  return {
    index,
    entry,
    kind,
    finish,
    h,
    t,
    d,
    back: 5 + r() * 6,
    bulge: rounded ? t * 0.1 : kind === "hard" ? t * 0.025 : 0,
    boardT: kind === "hard" ? 2.4 : 0,
    square: kind === "hard" ? 3 : 0,
    colour,
    ink,
    foil,
    band,
    rules,
    stamp: stamps[Math.floor(r() * stamps.length)]!,
    worn: r() < 0.1,
    cracks: kind !== "hard" && r() < 0.3 ? [0.32 + r() * 0.1, 0.6 + r() * 0.12] : [],
    gloss: finish === "jacket" || kind === "mass",
    pose: "up",
    x: 0,
    z: 0,
    lean: 0,
    lo: 0,
    hi: 0,
    accent: false,
    slot: index,
    labels: [],
  };
}

const GAP = (r: () => number) => 0.6 + r() * 0.9;

export function layoutShelf(entries: Entry[] | null): Shelf {
  const titled = Boolean(entries && entries.length);
  const list: (Entry | null)[] = titled ? entries! : Array.from({ length: FALLBACK_COUNT }, () => null);
  const books = list.map((entry, index) => makeBook(entry, index));
  const count = books.length;
  const r = random(hash(books.map((book) => keyOf(book.entry, book.index)).join("/")));

  const stacks: [number, number][] = count >= 12 ? [[Math.round(count * 0.3), 3], [Math.round(count * 0.68), 2]] : [];
  const inStack = (index: number) => stacks.find(([start, size]) => index >= start && index < start + size);
  const leaners = new Set<number>(stacks.map(([start, size]) => start + size).filter((index) => index < count));
  if (count >= 8) leaners.add(4);
  const loose = new Set<number>([Math.round(count * 0.18), Math.round(count * 0.52), Math.round(count * 0.86)]);

  const candidates = books.filter((book) => book.index > count * 0.36 && book.index < count * 0.64 && !inStack(book.index) && !leaners.has(book.index));
  const accent = candidates.reduce<Book | null>((best, book) => (!best || hash(keyOf(book.entry, book.index) + "#") > hash(keyOf(best.entry, best.index) + "#") ? book : best), null);
  if (accent) {
    accent.accent = true;
    accent.colour = ACCENT;
    accent.ink = FOIL_INK;
    accent.finish = "cloth";
    accent.foil = true;
    accent.band = null;
    accent.gloss = false;
    accent.rules = [11, 13.2, accent.h - 13.2, accent.h - 11];
  }

  const stone = { x0: 36, x1: 86 };
  let cursor = stone.x1 + 0.8;
  let corners: [number, number][] = [[stone.x1, 150]];
  let leftBook: Book | null = null;

  for (let index = 0; index < count; index++) {
    const stack = inStack(index);
    if (stack && stack[0] === index) {
      const members = books.slice(index, index + stack[1]).sort((a, b) => b.h - a.h);
      const longest = members[0]!.h;
      let z = 0;
      members.forEach((book, at) => {
        book.pose = "flat";
        book.slot = index;
        book.x = cursor + (longest - book.h) * (0.35 + 0.3 * r()) + (at ? (r() - 0.5) * 6 : 0);
        book.x = Math.max(cursor, Math.min(cursor + longest - book.h, book.x));
        book.z = z;
        book.bulge = Math.min(book.bulge, book.t * 0.03);
        book.cracks = [];
        z += book.t;
      });
      if (leftBook) leftBook.hi = Math.asin(Math.min(0.9, 0.75 / leftBook.h));
      cursor += longest + 1.2;
      corners = members.map((book) => [book.x + book.h, book.z + book.t]);
      leftBook = null;
      index += stack[1] - 1;
      continue;
    }
    const book = books[index]!;
    if (leaners.has(index)) {
      const phi = leftBook ? 0.09 + r() * 0.03 : 0.27 + r() * 0.07;
      book.lean = -phi;
      book.x = Math.max(...corners.map(([x, z]) => x + 0.3 + Math.min(book.h * Math.cos(phi), z) * Math.tan(phi)));
      book.lo = -phi;
      book.hi = -phi + 0.045;
      if (leftBook) leftBook.hi = 0.002;
      cursor = book.x + book.t * Math.cos(phi) + 1.1;
    } else {
      const before = cursor;
      book.x = cursor;
      const gap = loose.has(index) ? 7 + r() * 4 : GAP(r);
      cursor = book.x + book.t + gap;
      book.lo = leftBook ? -Math.asin(Math.min(0.9, (0.75 * (before - (leftBook.x + leftBook.t))) / Math.min(book.h, leftBook.h))) : -Math.asin(0.75 / book.h);
      if (leftBook && leftBook.lean === 0) leftBook.hi = Math.asin(Math.min(0.9, (0.75 * (before - (leftBook.x + leftBook.t))) / Math.min(book.h, leftBook.h)));
      if (leftBook && leftBook.lean < 0) book.lo = -Math.asin(Math.min(0.9, 6 / book.h));
    }
    corners = [[rightOf(book), book.lean < 0 ? book.t * Math.sin(-book.lean) : book.h]];
    leftBook = book;
  }
  if (leftBook && leftBook.lean === 0) leftBook.hi = Math.asin(0.75 / leftBook.h);

  const iron = { x: cursor + 0.4 };
  const right = iron.x + 62 + 34;
  const brackets: Bracket[] = [];
  const span = right - 300;
  const bays = Math.max(1, Math.round(span / 420));
  for (let at = 0; at <= bays; at++) brackets.push({ x: 150 + (span * at) / bays });

  const lastRight = Math.max(...books.map(rightOf));
  return {
    books,
    left: 0,
    right,
    rowLeft: stone.x0,
    rowRight: iron.x + 62,
    lastRight,
    stone,
    iron,
    brackets,
    tallest: Math.max(...books.map((book) => (book.pose === "flat" ? book.z + book.t : book.h))),
    titled,
  };
}

export function rightOf(book: Book) {
  if (book.pose === "flat") return book.x + book.h;
  return book.lean < 0 ? book.x + book.t * Math.cos(book.lean) : book.x + book.t;
}

export function leftOf(book: Book) {
  if (book.pose === "flat") return book.x;
  return book.lean < 0 ? book.x + book.h * Math.sin(book.lean) : book.x;
}

const MONO_SPACING = 0.06;

function fitLine(text: string, font: Font, size: number, spacing: number, room: number, measure: Measure) {
  const width = measure(text, font, size, spacing * size);
  if (width <= room) return { size, width };
  const scaled = (size * room) / width;
  return { size: scaled, width: measure(text, font, scaled, spacing * scaled) };
}

function splitTwo(text: string) {
  const words = text.split(" ");
  if (words.length < 2) return null;
  let best: [string, string] | null = null;
  let score = Infinity;
  for (let cut = 1; cut < words.length; cut++) {
    const a = words.slice(0, cut).join(" ");
    const b = words.slice(cut).join(" ");
    const worst = Math.max(a.length, b.length);
    if (worst < score) {
      score = worst;
      best = [a, b];
    }
  }
  return best;
}

function wrap(text: string, font: Font, size: number, spacing: number, room: number, measure: Measure) {
  const lines: string[] = [];
  for (const word of text.split(" ")) {
    const last = lines[lines.length - 1];
    if (last && measure(`${last} ${word}`, font, size, spacing * size) <= room) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

function styleOf(book: Book): { font: Font; upper: boolean; spacing: number } {
  if (book.finish === "cloth") return { font: "display", upper: true, spacing: 0.08 };
  if (book.finish === "jacket") return { font: book.index % 2 ? "display" : "sans", upper: book.index % 3 === 0, spacing: 0.02 };
  return { font: "sans", upper: false, spacing: 0 };
}

export function labelBook(book: Book, measure: Measure) {
  book.labels = [];
  if (!book.entry) return;
  const style = styleOf(book);
  const caps = (text: string) => (style.upper ? text.toUpperCase() : text);
  const title = caps(spineTitle(book.entry.title));
  const author = book.entry.author;
  const { t, h } = book;

  if (book.pose === "up" && t >= 44) {
    const room = t - 8;
    let size = 7.2;
    let lines = wrap(title, style.font, size, style.spacing, room, measure);
    while (size > 3.6 && (lines.some((line) => measure(line, style.font, size, style.spacing * size) > room) || lines.length > 4)) {
      size *= 0.92;
      lines = wrap(title, style.font, size, style.spacing, room, measure);
    }
    const top = (book.band && book.band.v0 === 0 ? book.band.v1 : 0) + 20;
    lines.forEach((line, at) => {
      const fit = fitLine(line, style.font, size, style.spacing, room, measure);
      book.labels.push({ text: line, font: style.font, size: fit.size, spacing: style.spacing * fit.size, u: t / 2, v: top + at * size * 1.18, along: "u", anchor: "middle", width: fit.width });
    });
    if (author) {
      const name = surnames(author).toUpperCase();
      const fit = fitLine(name, "mono", 3.4, MONO_SPACING, room, measure);
      book.labels.push({ text: name, font: "mono", size: fit.size, spacing: MONO_SPACING * fit.size, u: t / 2, v: h - (book.band && book.band.v1 === h ? h - book.band.v0 : 0) - 24, along: "u", anchor: "middle", width: fit.width });
    }
    return;
  }

  const across = t - 2 * Math.max(2.2, t * 0.13);
  const head = book.foil ? 17 : book.band && book.band.v0 === 0 ? book.band.v1 + 8 : 14;
  const foot = 20 + (book.band && book.band.v1 === h ? h - book.band.v0 : 0);
  let authorText = "";
  let authorFit = { size: 0, width: 0 };
  if (author) {
    const full = author.toUpperCase();
    const short = surnames(author).toUpperCase();
    const size = Math.min(3.6, across * 0.55);
    const reach = h * 0.34;
    for (const option of [full, short]) {
      const fit = fitLine(option, "mono", size, MONO_SPACING, reach, measure);
      if (fit.size >= Math.min(2.8, size)) {
        authorText = option;
        authorFit = fit;
        break;
      }
    }
  }
  const authorEnd = h - foot;
  const titleEnd = authorText ? authorEnd - authorFit.width - 9 : authorEnd;
  const reach = titleEnd - head;
  const single = fitLine(title, style.font, Math.min(9.5, across / 0.82), style.spacing, reach, measure);
  const pair = splitTwo(title);
  let twoLines: { lines: [string, string]; size: number; widths: [number, number] } | null = null;
  if (pair && single.size < 5.2) {
    const size = Math.min(9.5, across / (0.82 * 2.15));
    const a = fitLine(pair[0], style.font, size, style.spacing, reach, measure);
    const b = fitLine(pair[1], style.font, size, style.spacing, reach, measure);
    const common = Math.min(a.size, b.size);
    if (common > single.size * 1.15) {
      twoLines = {
        lines: pair,
        size: common,
        widths: [measure(pair[0], style.font, common, style.spacing * common), measure(pair[1], style.font, common, style.spacing * common)],
      };
    }
  }
  const middle = head + reach / 2;
  if (twoLines) {
    const gap = twoLines.size * 0.62;
    twoLines.lines.forEach((line, at) => {
      book.labels.push({ text: line, font: style.font, size: twoLines!.size, spacing: style.spacing * twoLines!.size, u: t / 2 + (at === 0 ? gap : -gap), v: middle, along: "v", anchor: "middle", width: twoLines!.widths[at]! });
    });
  } else {
    book.labels.push({ text: title, font: style.font, size: single.size, spacing: style.spacing * single.size, u: t / 2, v: middle, along: "v", anchor: "middle", width: single.width });
  }
  if (authorText) {
    book.labels.push({ text: authorText, font: "mono", size: authorFit.size, spacing: MONO_SPACING * authorFit.size, u: t / 2, v: authorEnd, along: "v", anchor: "end", width: authorFit.width });
  }
}

export function labelShelf(shelf: Shelf, measure: Measure) {
  shelf.books.forEach((book) => labelBook(book, measure));
}
