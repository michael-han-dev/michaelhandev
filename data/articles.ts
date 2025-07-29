export interface Article {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  content?: string;
  readTime?: number;
}

export const articles: Article[] = [
  {
    id: "hyperloop",
    title: "Socio-Economic Research and Analysis of TransPod and Various Hyperloop Projects Around The World",
    excerpt: "Research Publication on Hyperloop Technology",
    date: "2023-07-22",
    slug: "Hyperloop",
    readTime: 5
  },
  {
    id: "transforming",
    title: "Transforming Ancient Technology: Windows",
    excerpt: "Using Quantum Dot Solar Technology to Electrify Windows",
    date: "2023-08-18",
    slug: "quantum-dot",
    readTime: 6
  },
  {
    id: "star",
    title: "Fusing Futures - Shaping Climate Solutions with Star Power",
    excerpt: "An Analysis of Fusion Energy and Helion",
    date: "2023-08-15", 
    slug: "star",
    readTime: 4
  },
  {
    id: "ultron",
    title: "A 10x Idea Using LLMs: The Age of Ultron",
    excerpt: "Bringing peace? No. Bringing a more sustainable future? Maybe....?",
    date: "2023-08-13", 
    slug: "ultron",
    readTime: 3
  },
];

export const getRecentArticles = (count: number = 4): Article[] => {
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};