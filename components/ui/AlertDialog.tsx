'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface AlertDialogProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function AlertDialog({ open, message, onClose }: AlertDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface border border-text-secondary/10 rounded-3xl p-6 max-w-sm w-full shadow-xl text-center">
              <div className="p-3 bg-primary/10 rounded-2xl inline-flex mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-text-primary text-sm leading-relaxed mb-6">{message}</p>
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-2xl bg-primary/20 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
              >
                That&apos;s okay
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
