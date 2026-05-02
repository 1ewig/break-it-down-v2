# Implementation Plan: State & Data Modernization 🚀

This document outlines the roadmap for migrating the **Break It Down** state management system to a specialized architecture using **Zustand** and **TanStack Query**.

## 🎯 Goals
- **Separation of Concerns**: UI state vs. Server data.
- **Reliability**: Robust error handling and automatic retry logic.
- **Performance**: Intelligent caching and optimistic UI updates.
- **Maintainability**: Cleaner hooks and reduced boilerplate.

## 🛠 New Dependencies
- `zustand`: Lightweight client-side state management.
- `@tanstack/react-query`: Powerful asynchronous state management (Server state).
- `@tanstack/react-query-devtools`: (Dev only) For debugging cache and queries.

---

## 📅 Roadmap

### Phase 1: Infrastructure & Providers
- [x] Install dependencies.
- [x] Create `providers/QueryProvider.tsx` and wrap the root layout.
- [x] Initialize `QueryClient` with a focus on "Gentle" revalidation (lower frequency to maintain calm UX).


### Phase 2: Global UI Store (Zustand)
**File: `store/useUIStore.ts`**
- [x] Migrate `Sidebar` state (remove local `useState`).
- [x] Implement `persist` middleware for user preferences.
- [x] Add state for "Active AI Generation" to show global progress.

### Phase 3: Server State Hooks (TanStack Query)
**File: `hooks/queries/useTasksQuery.ts`**
- [ ] Implement `useTasks` query to fetch from Supabase.
- [ ] Setup `staleTime` and `cacheTime` for persistent local data.

**File: `hooks/mutations/useTaskMutations.ts`**
- [ ] `useCreateTask`: Mutation for AI generation.
- [ ] `useUpdateStep`: Mutation for completion with Optimistic Updates.
- [ ] `useBreakdownStep`: Mutation for recursive breakdowns.

### Phase 4: Component Integration
- [ ] **Sidebar**: Connect to `useUIStore`.
- [ ] **Home Page**: Connect to `useCreateTask` mutation.
- [ ] **Task List**: Use the query hook; implement "Skeleton" loading states for a better feel.
- [ ] **Step Item**: Connect to `useUpdateStep` for instant feedback.

---

## 🎨 Anticipated DX Improvements
- **No more `useEffect` for data**: All syncing happens declaratively.
- **Instant UI**: Checking a box will update the progress bar locally *before* the database confirms.
- **Automatic Retries**: If a Groq/AI call fails due to rate limits, the library will handle the retry logic gracefully.
