'use client';

import { motion } from 'framer-motion';

interface FilterBarProps {
  active: string;
  onChange: (category: string) => void;
}

const categories = ['All', 'Infrastructure', 'Restoration', 'Automotive', 'Fabrication'] as const;

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border pb-3">
      {categories.map((cat) => {
        const isActive = cat === active;
        return (
          <motion.button
            key={cat}
            onClick={() => onChange(cat)}
            whileTap={{ scale: 0.97 }}
            className={`relative rounded-sm px-3 py-1.5 text-xs font-medium transition-colors ${
              isActive ? 'text-accent' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {cat}
            {isActive && (
              <motion.div
                layoutId="filter-active"
                className="absolute inset-x-1 bottom-0 h-px bg-accent"
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
