import { aiops } from "./aiops";

export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  category?: string;
  technologies?: string[];
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period?: string;
  description: string;
}

interface PersonalLinks {
  email?: string;
  github?: string;
  linkedin?: string;
  /** File path relative to public/, beginning with a slash. */
  cv?: `/${string}.pdf`;
}

export const profile = {
  name: "Awab Zemzemi",
  eyebrow: "AI Engineering / Software Systems",
  introduction: "I'm Awab, an engineering student at INSAT focused on AI agents and the software infrastructure behind them.",
  about: [
    "What interests me about an AI agent is what happens after it chooses a tool. Which service handles the request? What does the agent do if the response is late or incomplete?",
    "At INSAT, I’m exploring those questions through backend engineering and infrastructure. I like following a request all the way through a system, from its API contract to the logs that help explain a failed run.",
  ],
};

export const links: PersonalLinks = {
  email: undefined,
  github: undefined,
  linkedin: undefined,
  cv: undefined,
};

export const projects: Project[] = [aiops];

export const experience: Experience[] = [];

export const education: Experience[] = [
  {
    id: "insat",
    role: "Engineering student",
    organization: "INSAT",
    description: "My interests span AI engineering, agentic systems, backend engineering, and infrastructure.",
  },
];
