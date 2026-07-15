'use client';

import { motion } from 'framer-motion';
import { StatusDot } from '@/components/ui/StatusDot';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' as const },
};

export function HeroSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      {/* Terminal-style greeting */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0 }}
        className="mb-4 font-mono text-xs text-zinc-500"
      >
        {'$'} whoami{' '}
        <span className="inline-block h-4 w-0.5 animate-pulse bg-zinc-500 align-middle" />
      </motion.div>

      {/* Name / Title */}
      <motion.h1
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.05 }}
        className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        Systems Integration Engineer
      </motion.h1>

      {/* Technical description */}
      <motion.p
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.1 }}
        className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
      >
        Focusing on autonomous infrastructure, high-performance local compute, and hardware orchestration.
        Building systems that run entirely offline with zero cloud dependency.
      </motion.p>

      {/* Status indicator */}
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={{ ...fadeInUp.transition, delay: 0.15 }}
        className="mt-6 flex items-center gap-2"
      >
        <StatusDot variant="online" />
        <span className="font-mono text-xs text-zinc-500">All systems operational</span>
      </motion.div>
    </section>
  );
}
