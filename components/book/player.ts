import { LEAVES } from "./geometry";
import { BookModel, T_END, T_ENDPAPER, type Frame } from "./model";
import { estimate, type Font, type Library, type Measure } from "./pages";
import { baseScale, buildArt, cameraAt, renderScene, type BookArt, type Stage } from "./scene";

export interface Source {
  titles: string[] | null;
  excerpt: string;
}

export interface Player {
  frame: () => Frame;
  seek: (time: number) => void;
  play: (onTick?: (frame: Frame) => void, sourceOf?: () => Source) => void;
  stop: () => void;
  setSource: (source: Source) => void;
  resize: () => void;
}

const FAMILIES: Record<Font, string> = {
  sans: "--font-geist-sans",
  display: "--font-display",
  mono: "--font-geist-mono",
};

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
      context.font = `${font === "display" ? 500 : 400} 100px ${familyOf(font)}`;
      width = context.measureText(text).width / 100;
      cache.set(key, width);
    }
    return width * size + spacing * text.length;
  };
}

const COVER_FROZEN = 0.15;
const IDLE_AFTER = 0.5;

export function fontsFor(host: Element) {
  if (typeof document === "undefined" || !document.fonts?.load) return Promise.resolve();
  const style = getComputedStyle(host);
  const loads = (Object.keys(FAMILIES) as Font[]).map((font) => {
    const family = style.getPropertyValue(FAMILIES[font]).trim();
    return family ? document.fonts.load(`${font === "display" ? 500 : 400} 16px ${family}`).catch(() => []) : Promise.resolve([]);
  });
  return Promise.all(loads).then(() => undefined);
}

export function createPlayer(svg: SVGSVGElement, layer: SVGGElement, initial: Source): Player {
  const model = new BookModel();
  let source = initial;
  let measure = canvasMeasure(svg);
  let library: Library = { titles: source.titles ?? [], excerpt: source.excerpt, measure };
  let art: BookArt = buildArt(library, LEAVES);
  let titled = Boolean(source.titles?.length);
  let stage: Stage = { width: 1, height: 1 };
  let scale = 1;
  let raf = 0;
  let last = 0;

  const resize = () => {
    const box = svg.getBoundingClientRect();
    stage = { width: Math.max(1, box.width), height: Math.max(1, box.height) };
    scale = baseScale(stage);
    svg.setAttribute("viewBox", `0 0 ${stage.width} ${stage.height}`);
  };

  const refreshPages = () => {
    if (model.frame.t >= T_ENDPAPER - 0.05) return;
    measure = canvasMeasure(svg);
    library = { titles: source.titles ?? [], excerpt: source.excerpt, measure };
    const next = buildArt(library, LEAVES);
    art = model.frame.t < COVER_FROZEN ? next : { ...next, cover: art.cover };
    titled = Boolean(source.titles?.length);
  };

  const draw = () => {
    const frame = model.frame;
    const cam = cameraAt(frame, stage, scale);
    svg.style.setProperty("--k", (Math.round(cam.k * 1000) / 1000).toString());
    layer.setAttribute("opacity", frame.opacity.toFixed(3));
    layer.innerHTML = renderScene(frame, cam, art, library);
  };

  const tick = (now: number) => {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const next = sourceOf?.();
    if (next && next !== source) setSource(next);
    if (model.frame.t < T_END + IDLE_AFTER) {
      model.step(dt);
      draw();
    }
    onTickHandler?.(model.frame);
    raf = requestAnimationFrame(tick);
  };

  let onTickHandler: ((frame: Frame) => void) | undefined;
  let sourceOf: (() => Source) | undefined;

  const setSource = (next: Source) => {
    source = next;
    if (!titled && next.titles?.length) refreshPages();
  };

  resize();
  draw();

  fontsFor(svg).then(() => {
    refreshPages();
    draw();
  });

  return {
    frame: () => model.frame,
    seek: (time) => {
      model.seek(time);
      draw();
    },
    play: (onTick, pull) => {
      onTickHandler = onTick;
      sourceOf = pull;
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    },
    stop: () => {
      cancelAnimationFrame(raf);
      raf = 0;
    },
    setSource,
    resize: () => {
      resize();
      draw();
    },
  };
}
