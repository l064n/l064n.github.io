export type ProjectCategory = 'Infrastructure' | 'Restoration' | 'Automotive' | 'Fabrication';

export interface Project {
  slug: string;
  title: string;
  description: string;
  role: string;
  stack: string[];
  impact: string;
  categories: ProjectCategory[];
  status: 'Active' | 'Completed' | 'Archived';
  date: string;
}

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
  url: 'https://logan.dev',
  location: 'Oakland, California (Bay Area)',
  education: 'UC Santa Cruz (UCSC)',
  currentTitle: 'Systems Integration Engineer at Zoox',
  focus: 'Autonomous vehicle infrastructure and hardware orchestration',
  workstation: 'Dual AMD Radeon Instinct MI50 · 64GB HBM2',
  osEnv: 'macOS · Nix-Darwin · Ghostty · Z Shell + Starship + Zoxide',
  knowledgeManagement: 'Obsidian (migrated from OneNote, 2017–present)',
};

export const statusMetrics: StatusMetric[] = [
  { label: 'location', value: 'Oakland, CA', indicator: 'online' },
  { label: 'role', value: 'Systems Integration Engineer, Zoox', indicator: 'online' },
  { label: 'focus', value: 'Autonomous vehicle infrastructure and hardware orchestration' },
  { label: 'workstation', value: 'Dual AMD Radeon Instinct MI50' },
  { label: 'env', value: 'Nix-Darwin · Ghostty · Z Shell + Starship' },
  { label: 'kmgmt', value: 'Obsidian (migrated from OneNote, 2017–present)' },
];

export const projects: Project[] = [
  {
    slug: 'local-llm-infrastructure',
    title: 'Local LLM Infrastructure',
    description:
      'Multi-GPU cluster orchestration for local large-language-model inference, spanning RTX 3090, MI50, and Jetson AGX Orin nodes with custom NVLink topology planning and liquid-cooling integration.',
    role: 'Lead Systems Engineer',
    stack: ['CUDA', 'PyTorch', 'vLLM', 'Docker', 'Proxmox', 'ROCm'],
    impact: 'Achieved a 40% latency reduction for 70B-parameter inference across a heterogeneous GPU fleet',
    categories: ['Infrastructure'],
    status: 'Active',
    date: '2025-11-15',
  },
  {
    slug: 'macintosh-portable-restoration',
    title: '1989 Macintosh Portable Restoration',
    description:
      'Complete board-level restoration of a 1989 Apple Macintosh Portable: full recap, CRT phosphor alignment, logic-board diagnostics, and System 7 firmware recovery from original SCSI backup media.',
    role: 'Hardware Engineer',
    stack: ['Soldering (0603)', 'Oscilloscope', 'Logic Analyzer', 'OSForensics'],
    impact: 'Restored a 1989-era CRT laptop to fully operational condition with working video output',
    categories: ['Restoration'],
    status: 'Completed',
    date: '2025-08-22',
  },
  {
    slug: 'ender-3-pro-fabrication',
    title: 'Ender 3 Pro Precision Build',
    description:
      'In-depth modification of a Creality Ender 3 Pro FDM printer: BLTouch auto-bed leveling, microstepping recalibration (1/16 to 1/256), Z-offset tuning to ±0.01 mm, and custom Marlin firmware with linear advance.',
    role: 'Mechanical Design Lead',
    stack: ['Marlin', 'BLTouch', 'Klipper', 'Fusion 360'],
    impact: 'Achieved ±0.05 mm dimensional tolerance on 20 mm calibration cubes from consumer hardware',
    categories: ['Fabrication'],
    status: 'Active',
    date: '2025-12-01',
  },
  {
    slug: 'automotive-performance-telemetry',
    title: 'Automotive Performance Telemetry',
    description:
      'Head-to-head drag telemetry analysis of the Tesla Model S Plaid and Porsche Taycan Turbo S, with GPU-accelerated data processing, CAN-bus log parsing, and real-time powertrain metrics visualization.',
    role: 'Full Stack Developer',
    stack: ['Python', 'CAN Bus', 'VBIOS Tools', 'Grafana', 'InfluxDB'],
    impact: 'Built a reproducible 0–60 mph telemetry pipeline with sub-millisecond timing accuracy across 48 runs',
    categories: ['Automotive'],
    status: 'Active',
    date: '2026-01-10',
  },
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
    period: '2021 — 2024',
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
