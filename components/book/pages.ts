import { COVER_H, COVER_W, DOG_EAR, PAGE_H, PAGE_W } from "./geometry";

import type { Font, Measure } from "../intro/fonts";

export type { Font, Measure };
export type Ink = "rule" | "ink" | "soft" | "faint" | "pencil" | "marbleA" | "marbleB" | "marbleC" | "foil" | "deboss" | "weave" | "flap" | "plate";
export type At = [number, number];

export type Mark =
  | { kind: "line"; ink: Ink; pts: At[]; free?: boolean; closed?: boolean }
  | { kind: "text"; ink: Ink; x: number; y: number; size: number; font: Font; text: string; spacing?: number }
  | { kind: "poly"; ink: Ink; pts: At[] }
  | { kind: "dots"; ink: Ink; pts: At[]; r: number };

export interface FaceArt {
  marks: Mark[];
}

export interface Library {
  titles: string[];
  excerpt: string;
  measure: Measure;
}

const PAGES = 22;

function seeded(seed: number) {
  let state = seed * 9301 + 49297;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

function words(out: Mark[], text: string, x: number, y: number, size: number, font: Font, ink: Ink, measure: Measure, spacing = 0) {
  const gap = measure(" ", font, size, spacing);
  let at = x;
  for (const word of text.split(/\s+/).filter(Boolean)) {
    out.push({ kind: "text", ink, x: at, y, size, font, text: word, spacing });
    at += measure(word, font, size, spacing) + gap;
  }
  return at - gap;
}

function wrap(text: string, width: number, size: number, font: Font, measure: Measure) {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next, font, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function centred(out: Mark[], text: string, centre: number, y: number, size: number, font: Font, ink: Ink, measure: Measure, spacing = 0) {
  const width = measure(text, font, size, spacing);
  words(out, text, centre - width / 2, y, size, font, ink, measure, spacing);
}

function rect(x0: number, y0: number, x1: number, y1: number): At[] {
  return [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]];
}

function fleuron(out: Mark[], cx: number, cy: number, ink: Ink, size = 1.6) {
  out.push({ kind: "poly", ink, pts: [[cx, cy - size], [cx + size * 0.6, cy], [cx, cy + size], [cx - size * 0.6, cy]] });
  out.push({
    kind: "dots",
    ink,
    r: size * 0.22,
    pts: [[cx - size * 1.25, cy], [cx + size * 1.25, cy], [cx, cy - size * 1.6], [cx, cy + size * 1.6]],
  });
}

export function coverArt(lib: Library): FaceArt {
  const marks: Mark[] = [];
  for (let y = 1.1; y < COVER_H; y += 2.2) marks.push({ kind: "line", ink: "weave", pts: [[0, y], [COVER_W, y]] });
  for (let x = 1.1; x < COVER_W; x += 2.2) marks.push({ kind: "line", ink: "weave", pts: [[x, 0], [x, COVER_H]] });
  marks.push({ kind: "line", ink: "deboss", pts: [[4.2, 0], [4.2, COVER_H]] });
  marks.push({ kind: "line", ink: "foil", pts: [[4.9, 0], [4.9, COVER_H]] });
  const left = 6;
  const right = COVER_W - 1;
  marks.push({ kind: "line", ink: "deboss", pts: rect(left + 4, 8, right - 7, COVER_H - 8), closed: true });
  marks.push({ kind: "line", ink: "deboss", pts: rect(left + 6.2, 10.2, right - 9.2, COVER_H - 10.2), closed: true });
  for (const [x, y] of [[left + 10.4, 16.4], [right - 13.4, 16.4], [left + 10.4, COVER_H - 16.4], [right - 13.4, COVER_H - 16.4]] as At[]) fleuron(marks, x, y, "foil", 1.5);
  const centre = (left + right) / 2;
  for (const [dx, dy, ink] of [[0.32, 0.32, "deboss"], [0, 0, "foil"]] as const) {
    centred(marks, "Articles", centre + dx, 64 + dy, 14, "display", ink, lib.measure);
    centred(marks, "worth reading", centre + dx, 81 + dy, 14, "display", ink, lib.measure);
  }
  marks.push({ kind: "line", ink: "foil", pts: [[centre - 12, 92], [centre + 12, 92]] });
  marks.push({ kind: "dots", ink: "foil", r: 0.7, pts: [[centre - 13.6, 92], [centre + 13.6, 92]] });
  centred(marks, "MICHAELHAN.DEV", centre, 164, 3.2, "mono", "foil", lib.measure, 0.6);
  return { marks };
}

function marble(marks: Mark[], width: number, height: number, seed: number) {
  const inks: Ink[] = ["marbleA", "marbleB", "marbleC", "marbleB"];
  const random = seeded(seed);
  const phase = random() * 6;
  for (let j = 0, base = 3; base < height - 3; j++, base += 2.3) {
    const pts: At[] = [];
    for (let x = 0; x <= width + 0.01; x += Math.min(3, width - x || 3)) {
      const y =
        base +
        1.5 * Math.sin(x * 0.19 + j * 0.62 + phase) +
        0.8 * Math.sin(x * 0.053 + j * 0.27 + phase * 0.5) +
        0.35 * Math.sin(x * 0.83 + j * 1.3);
      pts.push([x, Math.min(height - 0.6, Math.max(0.6, y))]);
      if (x >= width) break;
    }
    marks.push({ kind: "line", ink: inks[j % inks.length]!, pts });
  }
}

export function pastedownArt(lib: Library): FaceArt {
  const marks: Mark[] = [];
  marble(marks, COVER_W, COVER_H, 3);
  const x0 = COVER_W / 2 - 25;
  const x1 = COVER_W / 2 + 25;
  const y0 = 38;
  const y1 = 104;
  marks.push({ kind: "poly", ink: "plate", pts: rect(x0, y0, x1, y1).slice(0, 4) });
  marks.push({ kind: "line", ink: "soft", pts: rect(x0, y0, x1, y1), closed: true });
  marks.push({ kind: "line", ink: "faint", pts: rect(x0 + 2.4, y0 + 2.4, x1 - 2.4, y1 - 2.4), closed: true });
  const cx = COVER_W / 2;
  centred(marks, "EX LIBRIS", cx, y0 + 12, 3, "mono", "soft", lib.measure, 0.9);
  const lamp: At[] = [[cx - 9, 70], [cx - 1, 72.5], [cx, 72.5], [cx + 1, 72.5], [cx + 9, 70]];
  marks.push({ kind: "line", ink: "ink", pts: [[cx - 9, 70], [cx - 9, 79], [cx - 1, 81.5], [cx - 1, 72.5]] });
  marks.push({ kind: "line", ink: "ink", pts: [[cx + 9, 70], [cx + 9, 79], [cx + 1, 81.5], [cx + 1, 72.5]] });
  marks.push({ kind: "line", ink: "ink", pts: lamp });
  marks.push({ kind: "line", ink: "ink", pts: [[cx - 1, 81.5], [cx, 82.4], [cx + 1, 81.5]] });
  for (const dy of [74.5, 77]) {
    marks.push({ kind: "line", ink: "faint", pts: [[cx - 7.4, dy - 1.6], [cx - 2.4, dy - 0.2]], free: true });
    marks.push({ kind: "line", ink: "faint", pts: [[cx + 2.4, dy - 0.2], [cx + 7.4, dy - 1.6]], free: true });
  }
  centred(marks, "michaelhan.dev", cx, 94, 5.4, "display", "ink", lib.measure);
  return { marks };
}

export function endpaperArt(seed: number): FaceArt {
  const marks: Mark[] = [];
  marble(marks, PAGE_W, PAGE_H, seed);
  return { marks };
}

export function contentsArt(lib: Library): FaceArt {
  const marks: Mark[] = [];
  const left = 15;
  const right = PAGE_W - 12;
  words(marks, "Contents", left, 30, 9, "display", "ink", lib.measure);
  marks.push({ kind: "line", ink: "faint", pts: [[left, 36], [right, 36]], free: true });
  const entries = lib.titles.slice(0, 10);
  const starts = startsOf(entries.length);
  let y = 47;
  const size = entries.length > 8 ? 3.5 : 3.9;
  const lead = size * 1.42;
  entries.forEach((title, index) => {
    const number = String(starts[index]);
    const numberWidth = lib.measure(number, "sans", size);
    const lines = wrap(title, right - left - 16, size, "sans", lib.measure);
    lines.forEach((line, row) => {
      const end = words(marks, line, left, y, size, "sans", "ink", lib.measure);
      if (row === lines.length - 1) {
        const dots: At[] = [];
        for (let x = end + 2.2; x < right - numberWidth - 2; x += 1.6) dots.push([x, y - 0.4]);
        if (dots.length) marks.push({ kind: "dots", ink: "soft", r: 0.22, pts: dots });
        words(marks, number, right - numberWidth, y, size, "sans", "ink", lib.measure);
      }
      y += lead;
    });
    if (index === checkedOf(entries)) {
      const cy = y - lead * lines.length;
      marks.push({ kind: "line", ink: "pencil", pts: [[left - 8.4, cy - 2.2], [left - 6.6, cy - 0.3], [left - 3.2, cy - 4.6]], free: true });
    }
    y += size * 0.9;
  });
  if (!entries.length) {
    for (let row = 0; row < 8; row++, y += 9.6) {
      marks.push({ kind: "line", ink: "rule", pts: [[left, y - 1], [left + 44 + ((row * 17) % 30), y - 1]], free: true });
      words(marks, String(1 + row * 3), right - 3, y, 3.9, "sans", "ink", lib.measure);
    }
  }
  centred(marks, "vii", PAGE_W / 2, 170, 3, "mono", "soft", lib.measure);
  return { marks };
}

export function epigraphArt(lib: Library): FaceArt {
  const marks: Mark[] = [];
  const lines = wrap(lib.excerpt, 70, 4.4, "display", lib.measure);
  let y = 72;
  for (const line of lines) {
    centred(marks, line, PAGE_W / 2, y, 4.4, "display", "soft", lib.measure);
    y += 6.6;
  }
  fleuron(marks, PAGE_W / 2, y + 6, "soft", 1.3);
  return { marks };
}

function checkedOf(entries: string[]) {
  const egg = entries.findIndex((title) => /egg/i.test(title));
  return egg >= 0 ? egg : Math.min(entries.length - 1, 2);
}

export function startsOf(count: number) {
  return Array.from({ length: count }, (_, index) => 1 + Math.floor((index * PAGES) / Math.max(1, count)));
}

function titleOfPage(lib: Library, page: number) {
  const entries = lib.titles.slice(0, 10);
  if (!entries.length) return { title: "", opener: false };
  const starts = startsOf(entries.length);
  let index = 0;
  starts.forEach((start, at) => {
    if (start <= page) index = at;
  });
  return { title: entries[index]!, opener: starts[index] === page };
}

function shorten(text: string, width: number, size: number, font: Font, measure: Measure, spacing: number) {
  if (measure(text, font, size, spacing) <= width) return text;
  const list = text.split(" ");
  while (list.length > 1 && measure(`${list.join(" ")}…`, font, size, spacing) > width) list.pop();
  return `${list.join(" ")}…`;
}

export function bodyArt(lib: Library, page: number, flap: boolean): FaceArt {
  const marks: Mark[] = [];
  const recto = page % 2 === 1;
  const left = recto ? 15 : 12;
  const right = recto ? PAGE_W - 12 : PAGE_W - 15;
  const measure = right - left;
  const random = seeded(page * 7 + 11);
  const { title, opener } = titleOfPage(lib, page);
  const lead = 4.7;
  let y = 24;
  let indentRows = 0;
  let indent = 0;
  if (opener) {
    const lines = wrap(title || "Untitled", measure - 8, 6.4, "display", lib.measure);
    y = 40;
    for (const line of lines) {
      words(marks, line, left, y, 6.4, "display", "ink", lib.measure);
      y += 8;
    }
    fleuron(marks, left + 2.2, y, "soft", 1.1);
    y += 12;
    const letter = (title.match(/[A-Za-z]/)?.[0] ?? "A").toUpperCase();
    words(marks, letter, left - 0.4, y + lead * 2 - 0.2, 15, "display", "ink", lib.measure);
    indent = lib.measure(letter, "display", 15) + 2.4;
    indentRows = 3;
    y -= 1.8;
  } else {
    const head = recto ? shorten(title.toUpperCase(), measure, 2.5, "mono", lib.measure, 0.5) : "ARTICLES WORTH READING";
    const width = lib.measure(head, "mono", 2.5, 0.5);
    words(marks, head, recto ? right - width : left, 13, 2.5, "mono", "soft", lib.measure, 0.5);
  }
  let row = 0;
  let paragraph = 0;
  let paragraphLength = 3 + Math.floor(random() * 5);
  while (y < 160) {
    const first = paragraph === 0 && !(opener && row === 0);
    const last = paragraph === paragraphLength - 1;
    const start = left + (row < indentRows ? indent : 0) + (first ? 5 : 0);
    const end = last ? left + measure * (0.28 + random() * 0.5) : right;
    if (end - start > 6) marks.push({ kind: "line", ink: "rule", pts: [[start, y - 1.1], [end, y - 1.1]], free: true });
    if (page === 9 && (row === 6 || row === 7)) {
      const from = row === 6 ? start + measure * 0.42 : start;
      const to = row === 6 ? end : left + measure * 0.55;
      const pts: At[] = [];
      for (let x = from; x <= to; x += 4) pts.push([x, y + 0.5 + Math.sin(x * 0.7) * 0.18]);
      pts.push([to, y + 0.5]);
      marks.push({ kind: "line", ink: "pencil", pts, free: true });
    }
    y += lead;
    row++;
    paragraph++;
    if (paragraph >= paragraphLength) {
      paragraph = 0;
      paragraphLength = 3 + Math.floor(random() * 6);
    }
  }
  if (page === 9) {
    const x = right + 4.4;
    marks.push({ kind: "line", ink: "pencil", pts: [[x, 24 + lead * 6 - 4], [x + 0.3, 24 + lead * 8 - 1]], free: true });
  }
  const folio = String(page);
  const folioWidth = lib.measure(folio, "mono", 3);
  words(marks, folio, recto ? right - folioWidth : left, 171, 3, "mono", "soft", lib.measure);
  if (flap && recto) {
    const x0 = PAGE_W - DOG_EAR;
    marks.push({ kind: "poly", ink: "flap", pts: [[x0, 0], [PAGE_W, DOG_EAR], [x0, DOG_EAR]] });
    marks.push({ kind: "line", ink: "soft", pts: [[x0, 0], [x0, DOG_EAR], [PAGE_W, DOG_EAR]] });
  }
  return { marks };
}

export const DOG_EAR_LEAF = 9;

export function leafArt(lib: Library, index: number): [FaceArt, FaceArt] {
  if (index === 0) return [endpaperArt(5), endpaperArt(8)];
  if (index === 1) return [contentsArt(lib), epigraphArt(lib)];
  const recto = 2 * (index - 2) + 1;
  return [bodyArt(lib, recto, index === DOG_EAR_LEAF), bodyArt(lib, recto + 1, false)];
}
