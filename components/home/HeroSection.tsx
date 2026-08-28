'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { StatusDot } from '@/components/ui/StatusDot';

// three.js is heavy; load the cluster scene out-of-band
const GpuClusterScene = dynamic(
  () => import('@/components/home/GpuClusterScene').then((m) => m.GpuClusterScene),
  { ssr: false, loading: () => <div className="h-full w-full" /> }
);

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariant = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easeOutExpo } },
};

// Subtle grid pattern background
const GridPattern = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 dot-grid opacity-30" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] animate-pulse-slow" />
  </div>
);

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-16">
      <GridPattern />

      <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(360px,440px)]">
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {/* Terminal-style greeting */}
        <motion.div
          variants={itemVariant}
          className="mb-4 font-mono text-xs text-zinc-500"
        >
          <span className="text-emerald-500/80">$</span> whoami
          <span className="inline-block h-4 w-0.5 bg-zinc-500 animate-blink align-middle ml-0.5" />
        </motion.div>

        {/* Accent line */}
        <motion.div
          variants={itemVariant}
          className="mb-6 h-px w-16 bg-gradient-to-r from-accent to-transparent"
        />

        {/* Main heading */}
        <motion.h1
          variants={itemVariant}
          className="mb-3 text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl md:text-5xl"
        >
          Systems Integration{' '}
          <span className="text-gradient-accent">Engineer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariant}
          className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg sm:leading-relaxed"
        >
          Autonomous vehicle infrastructure, high-performance local compute, and hardware orchestration —
          building systems that run entirely offline, with zero cloud dependency.
        </motion.p>

        {/* Status indicator row */}
        <motion.div
          variants={itemVariant}
          className="mt-8 flex items-center gap-3"
        >
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5">
            <StatusDot variant="online" />
            <span className="font-mono text-xs text-emerald-400/90">All systems operational</span>
          </div>

          <span className="h-4 w-px bg-zinc-700" />

          <span className="font-mono text-xs text-zinc-600">
            Oakland, California
          </span>
        </motion.div>

        {/* Quick stats row */}
        <motion.div
          variants={itemVariant}
          className="mt-8 grid grid-cols-3 gap-4 sm:gap-6"
        >
          {[
            { label: 'Experience', value: '5+ years' },
            { label: 'Workstation', value: 'Dual MI50' },
            { label: 'Stack', value: 'Full-stack' },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-zinc-800 pl-3">
              <div className="text-xs font-mono text-zinc-600">{stat.label}</div>
              <div className="mt-0.5 text-sm font-medium text-zinc-300">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

        {/* Live 3D cluster visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: easeOutExpo }}
          className="relative h-64 overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0b0b0d] sm:h-80 lg:h-[420px]"
        >
          <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-2 border-b border-zinc-800/60 bg-[#0b0b0d]/80 px-3 py-2 backdrop-blur">
            <span className="size-2.5 rounded-full bg-zinc-700/80" />
            <span className="size-2.5 rounded-full bg-zinc-700/80" />
            <span className="size-2.5 rounded-full bg-zinc-700/80" />
            <span className="ml-2 font-mono text-[11px] text-zinc-500">
              gpu_cluster --topology
            </span>
            <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-emerald-400/80">
              <StatusDot variant="online" pulse={false} />
              live
            </span>
          </div>
          <GpuClusterScene />
        </motion.div>
      </div>
    </section>
  );
}
