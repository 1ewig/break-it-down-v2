'use client';

import { useState } from 'react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';
import { FADE_IN_UP, SCALE_IN } from '@/lib/animations';

interface NameSettingProps {
  userName: string;
  onSave: (name: string) => void;
}

export function NameSetting({ userName, onSave }: NameSettingProps) {
  const [inputValue, setInputValue] = useState(userName);

  const handleBlur = () => {
    onSave(inputValue.trim());
  };

  return (
    <motion.div 
      variants={FADE_IN_UP}
      className="bg-surface p-6 md:p-8 rounded-3xl border border-text-secondary/5"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <motion.div 
            variants={SCALE_IN}
            className="p-3 bg-primary/10 rounded-2xl text-primary"
          >
            <User className="w-6 h-6" />
          </motion.div>
          <div>
            <h3 className="text-lg text-text-primary font-medium mb-1">Your Name</h3>
            <p className="text-text-secondary text-sm max-w-md">
              What should we call you? This personalizes your experience.
            </p>
          </div>
        </div>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          placeholder="Your name"
          className="bg-background border border-text-secondary/10 rounded-2xl px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/30 outline-none focus:border-primary/20 transition-all w-full md:w-48"
        />
      </div>
    </motion.div>
  );
}