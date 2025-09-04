export interface Experience {
  id: string;
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  link?: string;
}

export const experiences: Experience[] = [
  {
    id: "rootly",
    title: "Software Engineering Intern",
    company: "Rootly (YC S21)",
    description: "Building end to end AI incident management software serving companies like Nvidia, Dropbox, Figma and 100s more.",
    startDate: "2025-08-27",
    current: true,
    link: "https://rootly.com/"
  },
  {
    id: "merin",
    title: "Co-Founder",
    company: "Merin.ai",
    description: "Reimagining email as a recommendation engine. Prioritize, act, and move, without switching tabs.",
    startDate: "2025-03-30",
    endDate: "2025-07-20",
    link: "https://merin.ai"
  },
  {
    id: "bigpod",
    title: "Software Engineering Intern",
    company: "BigPod",
    description: "Generating UI configurations and code for embedded devices",
    startDate: "2025-04-15",
    endDate: "2025-06-30",
    link: "https://www.bigpod.io/"
  },
  {
    id: "aimodels",
    title: "Machine Learning Engineer",
    company: "AIModels Tech Inc",
    description: "Developing and optimizing LSTM and CNN models for time-series analysis, enhancing fault detection in data centers.",
    startDate: "2025-01-10",
    endDate: "2025-03-30",
    link: "https://aimodels.ca/"
  },
  {
    id: "buffalo",
    title: "Undergraduate Research Assistant",
    company: "University at Buffalo Pharmacy and Pharmaceutical Sciences",
    description: "Pharmacokinetics Modelling in Monolix Suite and Python. Research for HIV drug trials, under Dr. Qing Ma",
    startDate: "2024-06-01",
    endDate: "2024-08-30",
    link: "https://scholar.google.com/citations?view_op=view_citation&hl=en&user=wGFmSqMAAAAJ&citation_for_view=wGFmSqMAAAAJ:z_wVstp3MssC"
  }
];

export const getRecentExperiences = (count: number = 2): Experience[] => {
  return experiences
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, count);
};