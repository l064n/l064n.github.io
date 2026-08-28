'use client';

import { motion } from 'framer-motion';
import { TerminalWindow } from '@/components/ui/TerminalWindow';
import { statusMetrics, type StatusMetric } from '@/lib/data';
import { StatusDot } from '@/components/ui/StatusDot';
import { ClusterStatus } from '@/components/home/ClusterStatus';

const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.04 },
  },
};

const rowVariant = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

export function StatusDashboard() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <TerminalWindow title="system_status — bash">
          <div className="space-y-0.5 font-mono text-sm">
            {statusMetrics.map((metric: StatusMetric) => (
              <motion.div key={metric.label} variants={rowVariant} className="flex gap-4 hover:bg-white/[0.02] rounded px-2 -mx-2 py-0.5 transition-colors">
                <span className="shrink-0 w-36 truncate text-zinc-500">{metric.label}</span>
                <span className="text-zinc-300">
                  {metric.indicator && (
                    <span className="mr-2">
                      <StatusDot variant={metric.indicator} pulse={false} />
                    </span>
                  )}
                  {metric.value}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <ClusterStatus />
          </motion.div>
        </TerminalWindow>
      </motion.div>
    </section>
  );
}
