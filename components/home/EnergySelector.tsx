'use client';

import { useUIStore } from '@/store/useUIStore';
import type { EnergyLevel } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';
import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

const levelConfig: Record<EnergyLevel, {
  label: string;
  icon: typeof BatteryLow;
  tip: string;
  tagline: string;
}> = {
  low: {
    label: 'Low',
    icon: BatteryLow,
    tip: "I'm running on empty — give me the gentlest steps",
    tagline: 'Gentle, tiny steps. No pressure.',
  },
  medium: {
    label: 'Medium',
    icon: BatteryMedium,
    tip: 'I can do things — practical steps with a warm tone',
    tagline: 'Balanced steps. Warm and clear.',
  },
  high: {
    label: 'High',
    icon: BatteryFull,
    tip: "Let's go! — direct, action-oriented breakdowns",
    tagline: "Let's go. Direct and action-oriented.",
  },
};

const activeStyles: Record<EnergyLevel, string> = {
  low: 'bg-amber-400/15 border-amber-400/30 text-amber-400',
  medium: 'bg-sky-400/15 border-sky-400/30 text-sky-400',
  high: 'bg-emerald/15 border-emerald/30 text-emerald',
};

const taglineColors: Record<EnergyLevel, string> = {
  low: 'text-amber-400/70',
  medium: 'text-sky-400/70',
  high: 'text-emerald/70',
};

const inactiveStyle = 'bg-transparent border-text-secondary/10 text-text-secondary/40 hover:border-text-secondary/30 hover:text-text-secondary/60';

export function EnergySelector() {
  const energyLevel = useUIStore((s) => s.energyLevel);
  const setEnergyLevel = useUIStore((s) => s.setEnergyLevel);
  const current = levelConfig[energyLevel];

  return (
    <motion.div variants={FADE_IN_UP} className="flex flex-col items-center gap-2.5">
      <div className="flex items-center gap-2">
        {Object.entries(levelConfig).map(([level, config]) => {
          const isActive = energyLevel === level;
          const Icon = config.icon;
          return (
            <button
              key={level}
              type="button"
              onClick={() => setEnergyLevel(level as EnergyLevel)}
              title={config.tip}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${isActive ? activeStyles[level as EnergyLevel] : inactiveStyle}`}
            >
              <Icon size={15} />
              {config.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={energyLevel}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className={`text-xs font-medium tracking-wide ${taglineColors[energyLevel]}`}
        >
          {current.tagline}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
