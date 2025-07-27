export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  demo?: string;
  date: string;
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: "project-one",
    title: "Project One",
    description: "A brief description of your first project. Explain what technologies you used and what problem it solves.",
    image: "/next.svg",
    github: "https://github.com/yourusername/project-one",
    demo: "https://project-one-demo.com",
    date: "2024-01-15",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    id: "project-two",
    title: "Project Two", 
    description: "Another project description. Highlight the key features and your role in developing it.",
    image: "/vercel.svg",
    github: "https://github.com/yourusername/project-two",
    demo: "https://project-two-demo.com",
    date: "2024-01-10",
    technologies: ["React", "Node.js", "MongoDB"]
  },
  {
    id: "project-three",
    title: "Project Three",
    description: "Your third project showcasing different skills. Mention any unique challenges you overcame.",
    image: "/globe.svg",
    github: "https://github.com/yourusername/project-three",
    date: "2024-01-05",
    technologies: ["Vue.js", "Python", "PostgreSQL"]
  }
];

export const getRecentProjects = (count: number = 2): Project[] => {
  return projects
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
};