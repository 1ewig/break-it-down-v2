<div align="center">
  <img src="./public/assets/banner.png" alt="Break It Down Banner" width="100%" />

  # Break It Down
  ### *The Gentle AI Task Architect*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
  [![TanStack Query](https://img.shields.io/badge/TanStack_Query-5.x-FF4154?style=flat-square&logo=reactquery)](https://tanstack.com/query)
  [![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-Styling-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Groq](https://img.shields.io/badge/AI-Groq_%2F_Llama_3.3-red?style=flat-square)](https://groq.com/)

  **Turn overwhelming goals into tiny, non-threatening steps.** Built for high-achievers with executive dysfunction, burnout, or ADHD.
</div>

---

## Overview

**Break It Down** is a specialized productivity application that leverages Large Language Models (LLMs) to solve one of the biggest hurdles in task management: **The Barrier to Entry.**

Unlike traditional todo apps that just store your stress, Break It Down acts as a "Gentle Architect," using Groq-powered Llama 3.3 to gently decompose complex, vague goals into granular, actionable, and non-threatening micro-tasks.

## Engineering Highlights

### Gentle AI Decomposition
- **Gentle Decomposition**: Any task step can be gently broken down into smaller sub-steps when you need a little more guidance.
- **Tone Orchestration**: Engineered prompt systems that ensure the AI maintains a "Gentle" personality -- reframing scary tasks into encouraging, low-pressure actions.

### Optimistic UI with Server Persistence
- **Instant Feedback**: All task interactions (completion, creation, deletion) update the UI instantly via TanStack Query optimistic cache mutations before persisting to Supabase.
- **Server-Side Storage**: Data lives in Supabase PostgreSQL with Row Level Security -- user isolation enforced at the database level, not just the application layer.

### Custom Motion System
- **Centralized Animation Physics**: Developed a custom animation library built on top of **Motion**, utilizing specialized spring physics (`SPRING_GENTLE`) to maintain a "weighted" and "organic" feel across the entire app.
- **CSS-First Accordions**: Step card expansions use CSS `grid-template-rows` transitions instead of JS-driven height animations — GPU-composited, zero main-thread layout work, smooth 60fps on mobile.

### Energy-Aware AI
- **Adaptive Tone**: Users select their energy level (Low / Medium / High) before creating a task. The AI adjusts its persona, step granularity, and language accordingly — gentle and tiny for low-energy days, direct and action-oriented for high-energy moments.
- **Persisted Preference**: The selected level is saved in local storage and sent with every AI request, including step breakdowns.

### Auth UX
- **Contextual Errors**: Login distinguishes "no account with this email" from "wrong password" via a server endpoint using Supabase Admin API.
- **Duplicate Detection**: Signup detects existing accounts and offers a "Sign in instead" link with a single click.
- **Email Verification**: Confirmation emails sent via Brevo SMTP; users land on the dashboard after clicking the link.
- **Password Visibility**: Toggle (Eye/EyeOff) on all password fields.

## Architecture at a Glance

```text
├── app/                  # Next.js 15 App Router (Route Groups & Server Components)
│   ├── (auth)/           # Login, Register, Forgot/Update Password
│   ├── (dashboard)/      # Home, Tasks, Bin, Settings, Profile
│   ├── api/              # AI task creation/breakdown, auth email checks, billing
│   └── auth/callback     # OAuth + email confirmation handler
├── components/           # Domain-organized UI components
│   ├── auth/             # Auth form primitives (Input, Button, Error, Layout)
│   ├── home/             # HomeHeader, EnergySelector, TaskLoadingOverlay
│   ├── task-details/     # Step breakdown view (StepItem with internal sub-components)
│   ├── tasks-dashboard/  # Task grid (TaskCard, TasksList, floating bin)
│   ├── bin/              # Bin display (BinHeader, BinCard, BinList, BinEmpty)
│   ├── settings/         # Settings page (NameSetting, NotificationsToggle)
│   ├── landing/          # Public landing page (HeroSection, FeaturesSection, etc.)
│   └── ui/               # Sidebar, Toast, ConfirmDialog, ProgressBar, GentleCheckbox
├── hooks/                # TanStack Query hooks + UI logic hooks
├── lib/                  # Core utilities
│   ├── ai/               # AI prompts (energy-aware builders) & Zod schemas
│   ├── db/               # Supabase query layer (tasks, steps, bin, factory, barrel)
│   └── supabase/         # Client factories (browser, server, admin, tables)
├── providers/            # QueryProvider + AuthProvider (session context)
├── store/                # Zustand state (useUIStore + useToastStore)
├── supabase/             # Schema migrations & RLS policies
├── types/                # TypeScript interface definitions
└── middleware.ts         # Auth-guard middleware (cookie-based session)
```

## Getting Started

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file with the following:
   ```env
   # AI (Groq)
   GROQ_API_KEY=your_key_here

   # Application URL
   APP_URL=http://localhost:3000

   # Supabase (from Project Settings > API)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

   # Supabase Admin (from Project Settings > API > service_role)
   # WARNING: Keep secret. Never expose to the browser.
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

3. **Run Database Migrations**
   ```bash
   npx supabase migration up
   ```

4. **Launch**
   ```bash
   npm run dev
   ```

---

<div align="center">
  Built with care to make the impossible feel manageable.
</div>
