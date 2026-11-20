import { secondBrain } from "./second-brain";
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
  period: string;
  location: string;
  highlights?: string[];
  technologies?: string[];
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
    "I study Computer Networks and Telecommunications at INSAT and build AI agents and LLM applications. My work connects retrieval and model inference with the backend services that make them usable.",
    "I’ve worked on document processing, GPU-hosted inference, and Kubernetes infrastructure. I’m interested in making those systems reliable and maintainable, from validating model output to tracing failures after deployment.",
  ],
};

export const links: PersonalLinks = {
  email: "awab.zemzemi@insat.ucar.tn",
  github: "https://github.com/awabZemzemi",
  linkedin: "https://www.linkedin.com/in/zemzemi-awab-626370234/",
  cv: undefined,
};

export const projects: Project[] = [aiops, secondBrain];

export const experience: Experience[] = [
  {
    id: "bit-and-books",
    organization: "Bit&Books Inc.",
    role: "AI Intern",
    period: "July–August 2026",
    location: "Remote — Ottawa, Canada",
    highlights: [
      "Built a PaddleOCR-VL and LLM pipeline that converts invoices and receipts into bookkeeping transactions, recovers missing fields and line items, and checks arithmetic and totals.",
      "Used BGE-M3 and Qdrant to retrieve Chart of Accounts candidates, then used an LLM to select the account and flag uncertain classifications.",
      "Deployed vLLM inference on RunPod GPUs and wired it into a Python backend with a task queue and parallel workers. Processed 1,880 document-processing items during the internship.",
    ],
    technologies: ["Python", "FastAPI", "PaddleOCR-VL", "BGE-M3", "Qdrant", "vLLM", "RunPod"],
  },
  {
    id: "kian",
    organization: "KIAN Technology",
    role: "DevOps Intern",
    period: "July–August 2025",
    location: "Tunis, Tunisia",
    highlights: [
      "Deployed Wazuh on DigitalOcean Kubernetes for security monitoring and integrated Falco DaemonSets for webhook-based runtime alerts.",
      "Automated infrastructure provisioning with Terraform.",
    ],
    technologies: ["Kubernetes", "Wazuh", "Falco", "Terraform", "DigitalOcean"],
  },
  {
    id: "actia",
    organization: "ACTIA",
    role: "Mobile & Web Development Intern",
    period: "July–August 2024",
    location: "Tunis, Tunisia",
    highlights: [
      "Developed an e-bike battery monitoring app and battery-health dashboard using Flutter, Flask, and Firebase.",
      "Automated builds with Docker and Jenkins CI/CD.",
    ],
    technologies: ["Flutter", "Python", "Flask", "Firebase", "Docker", "Jenkins"],
  },
];

export const education: Experience[] = [
  {
    id: "insat",
    organization: "National Institute of Applied Sciences and Technology (INSAT)",
    role: "Engineering Degree in Computer Networks and Telecommunications",
    period: "Expected graduation 2027",
    location: "Tunis, Tunisia",
    technologies: ["Machine Learning and Deep Learning", "Software Architecture", "Microservices", "Cloud Computing"],
  },
];
