'use client';

import { useUIStore } from '@/store/useUIStore';
import type { EnergyLevel } from '@/types';
import { motion } from 'motion/react';
import { FADE_IN_UP } from '@/lib/animations';
import { BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

const levels: { level: EnergyLevel; label: string; icon: typeof BatteryLow }[] = [
  { level: 'low', label: 'Low', icon: BatteryLow },
  { level: 'medium', label: 'Medium', icon: BatteryMedium },
  { level: 'high', label: 'High', icon: BatteryFull },
];

const activeStyles: Record<EnergyLevel, string> = {
  low: 'bg-amber-400/15 border-amber-400/30 text-amber-400',
  medium: 'bg-sky-400/15 border-sky-400/30 text-sky-400',
  high: 'bg-emerald/15 border-emerald/30 text-emerald',
};

const inactiveStyle = 'bg-transparent border-text-secondary/10 text-text-secondary/50 hover:border-text-secondary/30 hover:text-text-secondary/70';

export function EnergySelector() {
  const energyLevel = useUIStore((s) => s.energyLevel);
  const setEnergyLevel = useUIStore((s) => s.setEnergyLevel);

  return (
    <motion.div variants={FADE_IN_UP} className="flex items-center gap-2">
      {levels.map(({ level, label, icon: Icon }) => {
        const isActive = energyLevel === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => setEnergyLevel(level)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${isActive ? activeStyles[level] : inactiveStyle}`}
          >
            <Icon size={14} />
            {label}
          </button>
        );
      })}
    </motion.div>
  );
}
