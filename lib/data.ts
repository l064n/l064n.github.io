export interface StatusMetric {
  label: string;
  value: string;
  indicator?: 'online' | 'offline' | 'warning';
}

export interface ExperienceEntry {
  company: string;
  title: string;
  period: string;
  milestones: string[];
}

export const siteConfig = {
  name: 'Logan Matthew Phillips',
  url: 'https://l064n.github.io',
  location: 'Oakland, California (Bay Area)',
  education: 'UC Santa Cruz (UCSC)',
  currentTitle: 'Systems Integration Engineer at Zoox',
  focus: 'Autonomous vehicle infrastructure and hardware orchestration',
  workstation: 'Dual AMD Radeon Instinct MI50 · 64GB HBM2',
  osEnv: 'macOS · Nix-Darwin · Ghostty · Z Shell + Starship + Zoxide',
  knowledgeManagement: 'Obsidian (migrated from OneNote, 2017–present)',
  email: 'phillips.logan.sc@gmail.com',
  github: 'https://github.com/l064n',
  linkedin: 'https://www.linkedin.com/in/loganmphillips/',
};

export const statusMetrics: StatusMetric[] = [
  { label: 'location', value: 'Oakland, CA', indicator: 'online' },
  { label: 'role', value: 'Systems Integration Engineer, Zoox', indicator: 'online' },
  { label: 'focus', value: 'Autonomous vehicle infrastructure and hardware orchestration' },
  { label: 'workstation', value: 'Dual AMD Radeon Instinct MI50 · 64GB HBM2' },
  { label: 'env', value: 'Nix-Darwin · Ghostty · Z Shell + Starship' },
];

export const experienceTimeline: ExperienceEntry[] = [
  {
    company: 'Zoox',
    title: 'Systems Integration Engineer',
    period: '2024 — Present',
    milestones: [
      'Orchestrated autonomous vehicle test-fleet infrastructure across Bay Area operations',
      'Built hardware-in-the-loop validation pipelines for perception stack integration',
      'Led GPU cluster provisioning (RTX 3090 / MI50) for simulation workloads',
      'Developed internal tooling for sensor calibration and data pipeline orchestration',
    ],
  },
  {
    company: 'Monarch Tractor',
    title: 'Systems Engineer',
    period: '2020 — 2024',
    milestones: [
      'Developed embedded systems integration for next-gen electric tractor platform (M1)',
      'Built CAN-bus telemetry and diagnostics infrastructure for field-deployed units',
      'Led hardware bring-up for custom PCBs with STM32 and NXP S32G processors',
      'Established CI/CD pipeline for embedded firmware flashing across 50+ test vehicles',
    ],
  },
];

export const physicalToolkit = [
  { name: 'Hakko FX-888D Soldering Station', category: 'Soldering' },
  { name: 'Palm Multimeter (True RMS)', category: 'Measurement' },
  { name: 'Rigol DS1054Z Oscilloscope', category: 'Diagnostics' },
  { name: 'Saleae Logic Pro 8', category: 'Signal Analysis' },
  { name: 'Torque Wrench Set (click-type)', category: 'Mechanical' },
  { name: 'Fox 350 Dirt Bike Gear', category: 'Recreation' },
];

export const navLinks = [
  { href: '/', label: '~' },
  { href: '/projects', label: 'projects' },
  { href: '/notes', label: 'notes' },
  { href: '/experience', label: 'experience' },
] as const;
