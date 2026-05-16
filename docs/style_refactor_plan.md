# Implementation Plan: Smart Design System Refactor

## 1. Goal
Transition to a token-driven system where every visual property is derived from a central theme. JSX will focus on **what** a component is (e.g., `.type-heading`, `.layout-stack`) rather than **how** it looks (e.g., `text-3xl font-bold mb-4`).

## 2. Phase 1: The Token Foundation (@theme)
We will expand the `@theme` block in `app/globals.css` to define a strict mathematical scale.

### A. Spacing & Gap Scale (8px Base)
Standardized spacing to be used for gaps, padding, and layout offsets.
- `--spacing-1: 0.25rem;` (4px)
- `--spacing-2: 0.5rem;` (8px)
- `--spacing-4: 1rem;` (16px)
- `--spacing-8: 2rem;` (32px)
- `--spacing-12: 3rem;` (48px)

### B. Typography Scale (Fluid & Clamped)
Centralizing the font sizes and line heights.
- `--text-display: clamp(2.5rem, 7vw, 5.5rem);`
- `--text-h1: clamp(2rem, 5vw, 3.5rem);`
- `--text-h2: 2rem;`
- `--text-body: 1rem;`
- `--text-sm: 0.875rem;`

### C. Semantic Colors
Unifying the brand across Landing and Dashboard.
- `--color-brand: var(--color-emerald);`
- `--color-surface-bg: var(--color-background);`
- `--color-surface-card: var(--color-surface);`

## 3. Phase 2: Preset Presets (@layer utilities)
Instead of applying 5 utilities to every text element, we create bundles.

### A. Typography Bundles
- `.type-display`: Uses `--text-display`, `font-bold`, `tracking-tight`, `leading-[1.05]`.
- `.type-heading`: Uses `--text-h1`, `font-semibold`, `tracking-tight`.
- `.type-body`: Uses `--text-body`, `font-medium`, `leading-relaxed`.
- `.type-label`: Uses `--text-sm`, `uppercase`, `tracking-widest`.

### B. Layout Containers (The "Gap" System)
Getting rid of margins for spacing.
- `.layout-stack-lg`: `flex flex-col gap-[var(--spacing-12)]`. (For sections)
- `.layout-stack-md`: `flex flex-col gap-[var(--spacing-6)]`. (For cards)
- `.layout-stack-sm`: `flex flex-col gap-[var(--spacing-2)]`. (For item groups)
- `.layout-row`: `flex items-center gap-[var(--spacing-3)]`.

## 4. Phase 3: Global Component Styles
Defining core UI atoms in CSS to clean up the React code.
- `.card-premium`: The glassmorphic, rounded container.
- `.button-primary`: The standardized Emerald button with hover states.
- `.input-standard`: The standardized form field style.

## 5. Example: Before vs. After

### Before (Utility Chaos)
```tsx
<div className="flex flex-col gap-8 md:gap-12 p-6 bg-[#121413] rounded-3xl border border-white/10">
  <h1 className="text-white font-bold tracking-tight text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.05]">
    Title
  </h1>
  <p className="text-white/55 font-medium text-lg mb-4">Description</p>
</div>
```

### After (Smart System)
```tsx
<div className="card-premium layout-stack-md">
  <h1 className="type-display">Title</h1>
  <p className="type-body opacity-55">Description</p>
</div>
```
