export const profile = {
  handle: 'kbs',
  name: 'K.B.S Srikar',
  fullName: 'Kasilanka Bhoopesh Siva Srikar',
  tagline: 'Full-stack engineering, applied ML, and embedded IoT',
  location: 'India',
  availability: 'available for full-time roles',
  bio: "i build things that have to actually work - kubernetes for ships at sea, retrieval systems that cite their sources, and audio code that protects your hearing. b.tech cse from vit vellore, class of 2026.",
  email: 'kbsivasrikar@gmail.com',
  github: 'https://github.com/kbssrikar7',
  // Intentional: the GitHub handle migrated kbss0000 -> kbssrikar7, LinkedIn did not.
  // This is not a typo. Do not "fix" it.
  linkedin: 'https://linkedin.com/in/kbss0000',
  siteUrl: 'https://kbssrikar7.github.io',
  resume: '/kbs-srikar-resume.pdf',
} as const;

export const education = {
  school: 'Vellore Institute of Technology',
  campus: 'Vellore, Tamil Nadu',
  degree: 'B.Tech, Computer Science and Engineering',
  period: 'July 2022 - August 2026',
  cgpa: '8.53 / 10',
} as const;

export const stack = [
  { label: 'languages', items: ['Python', 'TypeScript', 'Java', 'Rust', 'Swift', 'C++', 'SQL', 'Bash'] },
  { label: 'backend + ml', items: ['FastAPI', 'Django', 'Spring Boot', 'TensorFlow', 'OpenCV', 'XGBoost'] },
  { label: 'ai + retrieval', items: ['RAG', 'LangChain', 'Qdrant', 'ChromaDB', 'Hugging Face', 'Groq', 'MCP'] },
  { label: 'frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'shadcn/ui'] },
  { label: 'infra', items: ['Kubernetes', 'Docker', 'Terraform', 'Jenkins', 'GitHub Actions', 'Linux'] },
  { label: 'data + cloud', items: ['PostgreSQL', 'MySQL', 'Neon', 'AWS', 'GCP', 'Vercel', 'Cloudflare R2'] },
] as const;
