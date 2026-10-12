export interface Entry {
  title: string;
  author: string;
}

const SMALL = new Set(["a", "an", "the", "and", "but", "or", "nor", "of", "to", "in", "on", "at", "by", "for", "as"]);

const capital = (word: string) => word.replace(/(^|[-‐])(\p{Ll})/gu, (_, lead: string, letter: string) => lead + letter.toUpperCase());

export function titleCase(text: string) {
  let lead = true;
  return text
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      const first = lead;
      lead = word.endsWith(":");
      if (!first && SMALL.has(lower)) return lower;
      return word === lower ? capital(word) : word;
    })
    .join(" ");
}

export function parseEntry(raw: string): Entry | null {
  let text = raw.replace(/\s+/g, " ").trim();
  const paren = text.indexOf("(");
  if (paren >= 0) text = text.slice(0, paren).trim();
  if (!text) return null;
  let title = text;
  let author = "";
  const dash = text.indexOf(" - ");
  if (dash >= 0) {
    title = text.slice(0, dash);
    author = text.slice(dash + 3);
  } else {
    const by = text.toLowerCase().lastIndexOf(" by ");
    if (by > 0) {
      title = text.slice(0, by);
      author = text.slice(by + 4);
    }
  }
  return { title: titleCase(title.trim()), author: titleCase(author.trim().replace(/,$/, "")) };
}

export function entriesFrom(html: string): Entry[] {
  if (typeof DOMParser === "undefined" || !html) return [];
  const doc = new DOMParser().parseFromString(html, "text/html");
  return [...doc.querySelectorAll("li")].map((item) => parseEntry(item.textContent ?? "")).filter((entry): entry is Entry => Boolean(entry));
}

export function spineTitle(title: string) {
  const colon = title.indexOf(":");
  return (colon > 0 ? title.slice(0, colon) : title).trim();
}

export function surnames(author: string) {
  const people = author.split(/,| and | & /).map((name) => name.trim()).filter(Boolean);
  return people.map((name) => name.split(" ").pop() ?? name).join(" & ");
}
