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
  focus: 'Autonomous vehicle infrastructure & hardware orchestration',
  workstation: 'M1 Max MacBook Pro · 64GB Unified Memory',
  osEnv: 'macOS + Nix-Darwin · Ghostty · Z-shell + Starship + Zoxide',
  knowledgeManagement: 'Obsidian (migrating notes from OneNote since 2017)',
};

export const statusMetrics: StatusMetric[] = [
  { label: 'location', value: 'Oakland, CA', indicator: 'online' },
  { label: 'role', value: 'Systems Integration Engineer @ Zoox', indicator: 'online' },
  { label: 'focus', value: 'Autonomous vehicle infrastructure & hardware orchestration' },
  { label: 'workstation', value: 'M1 Max · 64GB Unified Memory' },
  { label: 'env', value: 'Nix-Darwin · Ghostty · Z-shell + Starship' },
  { label: 'kmgmt', value: 'Obsidian (migrating from OneNote since 2017)' },
];

export const projects: Project[] = [
  {
    slug: 'local-llm-infrastructure',
    title: 'Local LLM Infrastructure',
    description:
      'Multi-GPU cluster orchestration for local large-language-model inference. Built distributed training pipelines across RTX 3090s, MI50s, and Jetson AGX Orin nodes with custom NVLink topology planning and liquid-cooling integration.',
    role: 'Lead Systems Engineer',
    stack: ['CUDA', 'PyTorch', 'vLLM', 'Docker', 'Proxmox', 'ROCm'],
    impact: '40% latency reduction on 70B-parameter model inference across heterogeneous GPU fleet',
    categories: ['Infrastructure'],
    status: 'Active',
    date: '2025-11-15',
  },
  {
    slug: 'macintosh-portable-restoration',
    title: '1989 Macintosh Portable Restoration',
    description:
      'Full board-level restoration of a 1989 Apple Macintosh Portable. Capacitor replacement (recapping), CRT phosphor alignment, logic-board diagnostics with oscilloscope, and System 7 firmware recovery from original SCSI backup media.',
    role: 'Hardware Engineer',
    stack: ['Soldering (0603)', 'Oscilloscope', 'Logic Analyzer', 'OSForensics'],
    impact: 'Successfully revived 1989-era CRT laptop to fully operational state with working SCART output',
    categories: ['Restoration'],
    status: 'Completed',
    date: '2025-08-22',
  },
  {
    slug: 'ender-3-pro-fabrication',
    title: 'Advanced Ender 3 Pro Fabrication',
    description:
      'Deep-modification of Creality Ender 3 Pro FDM printer. BLTouch auto-bed-leveling installation, micro-stepping recalibration (1/16 to 1/256), Z-offset tuning to +/-0.01mm accuracy, and custom Marlin firmware compilation with linear advance.',
    role: 'Mechanical Design Lead',
    stack: ['Marlin FW', 'BLTouch', 'Klipper', 'Fusion 360'],
    impact: 'Achieved +/-0.05mm dimensional tolerance on 20mm calibration cubes from consumer hardware',
    categories: ['Fabrication'],
    status: 'Active',
    date: '2025-12-01',
  },
  {
    slug: 'automotive-performance-telemetry',
    title: 'Automotive Performance Telemetry',
    description:
      'Head-to-head drag telemetry analysis comparing Tesla Model S Plaid vs. Porsche Taycan Turbo S. Custom VBIOS flash profiling for GPU-accelerated data processing, CAN-bus log parsing, and real-time powertrain metrics visualization.',
    role: 'Full Stack Developer',
    stack: ['Python', 'CAN Bus', 'VBIOS Tools', 'Grafana', 'InfluxDB'],
    impact: 'Built reproducible 0-60 telemetry pipeline with sub-millisecond timing accuracy across 48 runs',
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
