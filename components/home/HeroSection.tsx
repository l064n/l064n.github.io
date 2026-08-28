'use client';

import { motion } from 'framer-motion';
import { StatusDot } from '@/components/ui/StatusDot';

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
    <section className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20">
      <GridPattern />

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
          Focusing on autonomous infrastructure, high-performance local compute, and hardware orchestration.
          Building systems that run entirely offline with zero cloud dependency.
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
            { label: 'Workstation', value: 'M1 Max' },
            { label: 'Stack', value: 'Full-stack' },
          ].map((stat) => (
            <div key={stat.label} className="border-l border-zinc-800 pl-3">
              <div className="text-xs font-mono text-zinc-600">{stat.label}</div>
              <div className="mt-0.5 text-sm font-medium text-zinc-300">{stat.value}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
