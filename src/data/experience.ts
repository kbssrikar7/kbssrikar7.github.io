export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  metrics: { value: string; label: string }[];
  bullets: string[];
};

export const experience: Experience[] = [
  {
    company: 'Volteo Maritime',
    role: 'Cloud, DevOps & Software Development Engineer Intern',
    period: 'April 2025 - June 2025',
    location: 'Kakinada, Andhra Pradesh (Hybrid)',
    summary:
      'Wayship, a maritime SaaS platform, runs telemetry off vessels in the middle of the ocean. Connectivity is intermittent by definition, so the platform has to stay correct when the network is not.',
    metrics: [
      { value: '200+', label: 'vessels' },
      { value: '2000+', label: 'seafarers' },
      { value: '99.9%', label: 'uptime' },
      { value: '10M+', label: 'data points / day' },
    ],
    bullets: [
      'Architected and managed Kubernetes clusters for Wayship, sustaining 99.9% uptime for real-time IoT telemetry processing across 200+ vessels and 10M+ data points daily.',
      'Automated CI/CD pipelines with Jenkins and Terraform for containerized maritime systems, cutting deployment time by 40% and eliminating manual configuration drift.',
    ],
  },
];
