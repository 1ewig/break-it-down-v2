'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useToastStore } from '@/store/useToastStore';
import { X } from 'lucide-react';

export function Toast() {
  const { message, visible, hideToast } = useToastStore();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div className="flex items-center gap-3 bg-surface border border-text-secondary/10 shadow-xl rounded-2xl px-5 py-3.5 text-sm text-text-primary max-w-md">
            <span className="flex-1">{message}</span>
            <button
              onClick={hideToast}
              className="text-text-secondary/40 hover:text-text-secondary p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
