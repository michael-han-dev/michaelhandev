export type Font = "sans" | "display" | "mono";

export type Measure = (text: string, font: Font, size: number, spacing?: number) => number;

const PER_EM: Record<Font, number> = { sans: 0.52, display: 0.5, mono: 0.6 };

export const estimate: Measure = (text, font, size, spacing = 0) => text.length * (size * PER_EM[font] + spacing);

const FAMILIES: Record<Font, string> = {
  sans: "--font-geist-sans",
  display: "--font-display",
  mono: "--font-geist-mono",
};

const weightOf = (font: Font) => (font === "display" ? 500 : 400);

export function canvasMeasure(host: Element): Measure {
  if (typeof document === "undefined") return estimate;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return estimate;
  const style = getComputedStyle(host);
  const familyOf = (font: Font) => style.getPropertyValue(FAMILIES[font]).trim() || (font === "mono" ? "monospace" : "sans-serif");
  const cache = new Map<string, number>();
  return (text, font, size, spacing = 0) => {
    const key = `${font}|${text}`;
    let width = cache.get(key);
    if (width === undefined) {
      context.font = `${weightOf(font)} 100px ${familyOf(font)}`;
      width = context.measureText(text).width / 100;
      cache.set(key, width);
    }
    return width * size + spacing * text.length;
  };
}

export function fontsFor(host: Element) {
  if (typeof document === "undefined" || !document.fonts?.load) return Promise.resolve();
  const style = getComputedStyle(host);
  const loads = (Object.keys(FAMILIES) as Font[]).map((font) => {
    const family = style.getPropertyValue(FAMILIES[font]).trim();
    return family ? document.fonts.load(`${weightOf(font)} 16px ${family}`).catch(() => []) : Promise.resolve([]);
  });
  return Promise.all(loads).then(() => undefined);
}
