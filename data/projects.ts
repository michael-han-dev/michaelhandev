export interface Project {
  id: string;
  title: string;
  description: string;
  github: string;
  demo?: string;
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: "twitter-embedder",
    title: "Twitter Embedder and Clusterer",
    description: "Developed a tool to scrape, embed, cluster, and visualize user tweets from twitter in a shared 2D/3D semantic space using UMAP, HDBSCAN, and cosine similarity.",
    github: "https://github.com/michael-han-dev/twitter-embeddings",
    demo: "https://x.com/michaelyhan_/status/1948109960858210448",
    technologies: ["Python", "Matplotlib", "Sentence-Transformers", "UMAP", "Numpy", "ChromaDB", "HDBSCAN", "Scikit Learn"]
  },
  {
    id: "turboread",
    title: "TurboReader", 
    description: "Turboreader is a speed-reading web app that overlays a translucent reader on any website, allowing users to read text rapidly with customizable words-per-minute and voice playback. It supports PDF uploads, highlights text word-by-word, and enables efficient visual or auditory consumption without leaving the current page.",
    github: "https://github.com/michael-han-dev/turboread",
    demo: "https://project-two-demo.com",
    technologies: ["Next.js", "Typescript", "Elysia", "AWS s3", "ElevenLabs", "Drizzle", "Docker"]
  },
  {
    id: "twitter-motivational",
    title: "Twitter AI Tweet Blocker",
    description: "A Chrome extension that helps you avoid AI-generated and low-quality content on Twitter/X.com by analyzing tweets using LLM integration. Fully customizable and semantic word blocking along with client side processing for privacy.",
    github: "https://x.com/michaelyhan_/status/1940209692967673959",
    technologies: ["Typescript", "Groq", "OpenAI"]
  },
  {
    id: "heida",
    title: "Heida.app",
    github: "https://heida.app/",
    description: "Heida is a comprehensive AI interface designed for professionals to interact with multiple AI models. It supports connection to 220+ AI models including OpenRouter models, Claude, and GPT-4 while allowing users to use their own API keys for cost control. The platform features document intelligence for analyzing PDFs and spreadsheets, interactive tools for visualizations and code execution, and AI augmentation with web search capabilities.",
    technologies: ["Next.js", "Supabase", "Typescript","FastAPI", "Docker", "Redis", "Vector Embeddings"]
  },
  {
    id: "queenspurity",
    title: "Queen's University Purity Score",
    github: "https://www.queenspuritytest.com/",
    description: "A classic spinoff of the traditional Rice Purity test game but built for Queen's University. 5000+ unique visitors, 20,000+ views.",
    technologies: ["Next.js", "Typescript", "Firebase", "Tailwind", "Umami Analytics", "Vercel"]
  }
];