/**
 * Landing page animations - used for the marketing landing page (/)
 * Import from '@/lib/motion'
 */

/* Spring transitions - much softer and smoother */
export const SPRING_GENTLE = { 
  type: 'spring' as const, 
  stiffness: 80,    // Reduced from 150 for softer feel
  damping: 20,      // Reduced from 25 for more bounce
  mass: 0.8        // Lighter for smoother motion
};

export const SPRING_SOFT = {
  type: 'spring' as const,
  stiffness: 50,    // Very gentle
  damping: 18,      // Smooth deceleration
  mass: 0.5
};

export const SPRING_SNAPPY = { 
  type: 'spring' as const, 
  stiffness: 200,   // Reduced from 300
  damping: 25,      // Smoother
};

/* Viewport-based animations with softer transitions */
export const FADE_UP = {
  initial: { opacity: 0, y: 32 },      // Increased from 24 for smoother drift
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },  // Increased margin for earlier trigger
  transition: { 
    duration: 0.8,     // Slower, more elegant
    ease: [0.22, 1, 0.36, 1]  // Quintic ease-out for buttery smoothness
  }
};

export const FADE_IN = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
};

export const STAGGER_CONTAINER = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    staggerChildren: 0.12,  // Slower stagger for more elegance
    delayChildren: 0.15,   // More delay before starting
    ease: [0.22, 1, 0.36, 1]
  }
};

/* Scale animations with soft elastic feel */
export const SCALE_IN = {
  initial: { opacity: 0, scale: 0.92 },  // Less aggressive scale
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-100px' },
  transition: { 
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1]
  }
};

/* Slide animations for horizontal elements */
export const SLIDE_LEFT = {
  initial: { opacity: 0, x: 40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};

export const SLIDE_RIGHT = {
  initial: { opacity: 0, x: -40 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
};