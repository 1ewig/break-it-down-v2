import { Variants, Transition } from 'motion/react';

/**
 * Standard spring transition for a "gentle" feel.
 */
export const SPRING_GENTLE: Transition = {
  type: 'spring',
  stiffness: 150, // Reduced from 260 for less "snap"
  damping: 25,    // Increased from 20 for more softness
};

export const SPRING_RELAXED: Transition = {
  type: 'spring',
  stiffness: 80,
  damping: 20,
};

export const TRANSITION_SMOOTH: Transition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1], // "Quintic" ease-out for a very soft finish
};

export const FADE_IN_UP: Variants = {
  initial: { opacity: 0, y: 8 }, // Reduced from 20 for a more subtle slide
  animate: { 
    opacity: 1, 
    y: 0,
    transition: SPRING_GENTLE
  },
  exit: { 
    opacity: 0, 
    y: -4,
    transition: { duration: 0.2 }
  }
};

export const FADE_IN: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.6 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const SCALE_IN: Variants = {
  initial: { opacity: 0, scale: 0.95 }, // Reduced from 0.8 to 0.95 for subtlety
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: SPRING_GENTLE
  }
};

export const STAGGER_CONTAINER: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Reduced from 0.1 for faster, smoother flow
      delayChildren: 0.05,  // Start sooner
    }
  }
};


/**
 * Layout transition for items that expand/collapse.
 */
export const ACCORDION_ANIMATION: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { 
    height: 'auto', 
    opacity: 1,
    transition: SPRING_GENTLE
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};
