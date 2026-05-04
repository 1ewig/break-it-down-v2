<div align="center">
  <img src="./public/assets/banner.png" alt="Break It Down Banner" width="100%" />

  # Break It Down 🌿
  ### *The Gentle AI Task Architect*

  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-Persistence-green?style=flat-square&logo=supabase)](https://supabase.com/)
  [![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-Styling-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![Groq](https://img.shields.io/badge/AI-Groq%20%2F%20Llama%203.3-red?style=flat-square)](https://groq.com/)

  **Turn overwhelming goals into tiny, non-threatening steps.** Built for high-achievers with executive dysfunction, burnout, or ADHD.
</div>

---

## 📖 Overview

**Break It Down** is a specialized productivity application that leverages Large Language Models (LLMs) to solve one of the biggest hurdles in task management: **The Barrier to Entry.** 

Unlike traditional todo apps that just store your stress, Break It Down acts as a "Gentle Architect," using Groq-powered Llama 3.3 to recursively decompose complex, vague goals into granular, actionable, and non-threatening micro-tasks.

## 🛠 Engineering Highlights

This project serves as a showcase for modern full-stack engineering patterns and complex UI/UX orchestration:

### 🧠 Recursive AI Decomposition
- **Deep Nesting**: Implemented a recursive logic that allows any task step to be further broken down into "tinier" steps indefinitely.
- **Tone Orchestration**: Engineered prompt systems that ensure the AI maintains a "Gentle" personality—reframing scary tasks into encouraging, low-pressure actions.

### ⚡ Advanced State Management
- **Dual-Layer Sync**: Orchestrated a robust state system using **Zustand** for transient UI state and **TanStack Query** for server state.
- **Optimistic UI**: All task interactions (completion, creation, deletion) update the UI instantly via optimistic cache mutations, providing a zero-latency feel while syncing with Supabase in the background.

### 🍃 Custom Motion System
- **Centralized Animation Physics**: Developed a custom animation library built on top of **Framer Motion**, utilizing specialized spring physics (`SPRING_GENTLE`) to maintain a "weighted" and "organic" feel across the entire app.
- **Layout Projection**: Leveraging Framer Motion's layout projection to handle complex list reordering and expansion without layout thrashing.

### ☁️ Persistent Architecture
- **Supabase Integration**: Real-time persistence with PostgreSQL.
- **Offline-First Persistence**: Middleware-driven `localStorage` sync ensures the app remains functional and responsive even with intermittent connectivity.

## 📂 Architecture at a Glance

```text
├── app/                  # Next.js 15 App Router (Route Groups & Server Components)
├── components/           # Atomic UI Design System
│   ├── tasks/            # Complex business logic components (StepItem, TaskCard)
│   └── ui/               # Reusable primitive components
├── store/                # Zustand global state (UI preferences & local persistence)
├── hooks/                # Specialized TanStack Query hooks for server state
├── lib/                  # Core utilities (AI prompts, Animation system, DB config)
└── types/                # Strict TypeScript interface definitions
```

## 🚀 Getting Started

1. **Clone & Install**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env.local` file with the following:
   ```env
   GROQ_API_KEY=your_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   ```

3. **Launch**
   ```bash
   npm run dev
   ```

---
<div align="center">
  Built with care to make the impossible feel manageable.
</div>
