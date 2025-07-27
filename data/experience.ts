export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    id: "research-engineer",
    title: "Research Engineer",
    company: "Merin.ai",
    description: "Developing AI-powered solutions for healthcare applications. Building scalable machine learning pipelines and conducting research on novel neural network architectures.",
    startDate: "2024-06-01",
    current: true
  },
  {
    id: "software-developer-intern",
    title: "Software Developer Intern",
    company: "Tech Innovation Labs",
    description: "Built full-stack web applications using React and Node.js. Collaborated with cross-functional teams to deliver high-quality software solutions for enterprise clients.",
    startDate: "2023-05-01",
    endDate: "2023-08-31"
  }
];

export const getRecentExperiences = (count: number = 2): Experience[] => {
  return experiences
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, count);
};