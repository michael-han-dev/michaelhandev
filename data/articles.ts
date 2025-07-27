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
    id: "learning-nextjs",
    title: "Learning Next.js",
    excerpt: "Thoughts and experiences while learning Next.js framework for React development.",
    date: "2024-01-08", 
    slug: "learning-nextjs",
    readTime: 8
  },
  {
    id: "portfolio-development",
    title: "Portfolio Development",
    excerpt: "The process of building this portfolio website from scratch using modern tools.",
    date: "2024-01-01",
    slug: "portfolio-development",
    readTime: 12
  }
];

export const getRecentArticles = (count: number = 3): Article[] => {
  return articles
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};