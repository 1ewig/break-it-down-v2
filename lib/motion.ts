export const SPRING_GENTLE = { type: 'spring' as const, stiffness: 150, damping: 25, mass: 1 };
export const SPRING_SNAPPY = { type: 'spring' as const, stiffness: 300, damping: 30 };

export const FADE_UP = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export const FADE_IN = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
};

export const STAGGER_CONTAINER = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { staggerChildren: 0.08, delayChildren: 0.1 },
};