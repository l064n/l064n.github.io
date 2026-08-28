'use client';

import { motion } from 'framer-motion';

interface FilterBarProps {
  active: string;
  onChange: (category: string) => void;
}

const categories = ['All', 'Infrastructure', 'Restoration', 'Automotive', 'Fabrication'] as const;

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 border-b border-[#1a1a1a] pb-3">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
              isActive ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {cat}
            {isActive && (
              <motion.div
                layoutId="filter-active"
                className="absolute inset-0 rounded-lg border border-zinc-700 bg-[#1a1a1a]/50"
                transition={{ duration: 0.2, type: 'spring', bounce: 0.15 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
