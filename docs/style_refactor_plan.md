# Implementation Plan: Visual Refactor & Design System

## 1. Overview
The goal of this refactor is to transition the **Break It Down** styling architecture from a pure Tailwind utility approach to a **Hybrid System**. We will use **Vanilla CSS** for global layout, positioning, and design tokens (variables), while retaining **Tailwind CSS** for micro-adjustments and component-specific styling.

## 2. Core Architecture
- **Vanilla CSS**: Used for `display`, `position`, `grid`, `flex`, `gap`, `padding/margin` (layout level), and `typography` (heading levels).
- **CSS Variables**: All "magic numbers" (colors, spacing, font sizes, border radii) will be moved to `:root` variables.
- **Tailwind**: Reserved for atomic utilities like `hover:effects`, `transitions`, `opacity`, and specific decorative properties.

## 3. The Design System (Variables)
We will define a unified set of tokens in `app/globals.css`.

### Tokens to Define:
- **Colors**: Primary (Emerald), Surface, Background, Text (Primary/Secondary), and Accent colors.
- **Spacing**: A scale based on `8px` (e.g., `--space-1: 0.25rem`, `--space-4: 1rem`).
- **Typography**: 
  - `--font-heading-lg`: The "Clamped" bold style from the landing page.
  - `--font-heading-md`: The Dashboard header style.
  - `--font-body`: Clean, readable weight for task text.
- **Radii**: Consistent rounding for cards and inputs (e.g., `--radius-lg: 2rem`).

## 4. Implementation Phases

### Phase 1: Foundation (The Tokens)
- [ ] Create a new branch `feat/css-refactor`.
- [ ] Update `app/globals.css` with a full `:root` variable list.
- [ ] Map existing Tailwind colors to these variables in `tailwind.config.ts` (so we can use both).

### Phase 2: Structural Layout
- [ ] Refactor `Sidebar.tsx`: Move the complex flex/positioning logic into a CSS module or global layout classes.
- [ ] Refactor the main dashboard wrapper (`app/(dashboard)/layout.tsx`) to use CSS Grid for the Sidebar/Main split.

### Phase 3: Component Realignment
- [ ] **Home Page**: Refactor `HomeHeader` and `HomeForm` to use standard layout classes.
- [ ] **Task List**: Move the `StepItem` layout (flex rows, padding) into CSS.
- [ ] **Typography Audit**: Replace ad-hoc `text-3xl font-bold` with semantic classes like `.heading-primary`.

## 5. Success Criteria
1. **Clean JSX**: Components should have 50% fewer Tailwind classes.
2. **Variable Control**: Changing `--color-primary` in one place updates the entire app (landing page and dashboard).
3. **Consistency**: Typography and spacing feel mathematically consistent across all screens.

## 6. Example Comparison

### Before (Current)
```tsx
<div className="flex flex-col items-center justify-center p-6 gap-8 md:gap-12 bg-surface rounded-3xl border border-text-secondary/10">
  <h1 className="text-3xl font-bold tracking-tight">Title</h1>
</div>
```

### After (Proposed)
```tsx
<div className="card-container layout-centered shadow-premium">
  <h1 className="heading-primary">Title</h1>
</div>
```
