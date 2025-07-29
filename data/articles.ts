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
    id: "my-first-blog-post",
    title: "My First Blog Post",
    excerpt: "This is a sample blog post excerpt. Replace with your actual blog content.",
    date: "2024-01-15",
    slug: "my-first-blog-post",
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
    id: "ultron",
    title: "A 10x Idea Using LLMs: The Age of Ultron",
    excerpt: "Bringing peace? No. Bringing a more sustainable future? Maybe....?",
    date: "2023-08-13", 
    slug: "ultron",
    readTime: 3
  },
];

export const getRecentArticles = (count: number = 3): Article[] => {
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};