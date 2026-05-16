# Codebase Analysis Report

## Performance Bottlenecks

### 1. Loading ALL data into memory (major)
**Files:** `lib/db/tasks.ts:4-8`, `lib/db/bin.ts:24-28`

`getTasksWithSteps()` and `getDeletedTasksWithSteps()` read **every task** and **every step** from IndexedDB into memory, then filter/join/sort client-side. No pagination, no limit. As the user accumulates tasks this grows linearly slower — 100+ tasks with 5-8 steps each means 500-800+ objects loaded on every page load.

### 2. Sequential deletes in purge loop
**File:** `lib/db/bin.ts:51-54`

`purgeExpiredDeletedTasks()` uses a `for` loop with individual `db.tasks.delete(task.id)` + `db.steps.where().delete()` inside a transaction. Should use `bulkDelete` or batch operations.

### 3. Missing database indexes
**File:** `lib/db/db.ts:9-12`

Only `id`, `task_id`, `parent_step_id` are indexed. `deleted_at`, `created_at`, `user_id`, `is_completed` are unindexed — all queries filtering on these fields do full table scans.

### 4. Redundant step loading on every completion toggle
**File:** `lib/db/steps.ts:19`

`updateStepCompletionInDB()` loads ALL steps for a task via `db.steps.where('task_id').equals(taskId).toArray()` just to recompute the progress percentage. Called every single time a checkbox is toggled.

### 5. Over-invalidation of queries
**File:** `hooks/useTaskMutations.ts`

Multiple mutations call `invalidateQueries` for both `['tasks', user?.id]` and `['task', taskId, user?.id]` in `onSettled`, despite already optimistically updating both caches in `onMutate`. This causes redundant background refetches on every mutation.

### 6. Unnecessary `(generateText as any)` type escape
**Files:** `app/api/tasks/create/route.ts:20`, `app/api/tasks/breakdown/route.ts:24`

Both API routes cast `generateText` to `any`, losing all type safety from the Vercel AI SDK.

---

## Security Bugs

### 1. No rate limiting on auth endpoints
**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/forgot-password/page.tsx`, `app/(auth)/update-password/page.tsx`

Login, register, forgot-password, and update-password pages have **zero rate limiting**. An attacker can brute-force credentials or spam password reset emails.

### 2. No email verification enforcement
The app never checks `user.email_confirmed_at` or similar. Supabase may allow unverified users to sign in depending on project configuration — no protection against unverified account access.

### 3. Session staleness on client-side
**File:** `providers/AuthProvider.tsx:30-48`

Only calls `getSession()` on mount and listens to `onAuthStateChange`. If a session is revoked server-side, the client state remains stale until next page reload.

### 4. Password validation is client-side only
**File:** `app/(auth)/register/page.tsx:38-41`

Password length (min 8) is validated only in the browser. If Supabase's project settings don't enforce this server-side, weak passwords could be accepted.

### 5. Duplicated Google OAuth handler (inconsistent state after error)
**Files:** `app/(auth)/login/page.tsx:33-41`, `app/(auth)/register/page.tsx:19-27`

If `handleGoogleSignIn` throws or redirects back with an error, there's no error handling — the user gets redirected to the callback page without feedback.

### 6. No input sanitization on task title
**File:** `app/api/tasks/create/route.ts:18`

`taskTitle` is read from the request body but never validated or sanitized before passing to the AI prompt (prompt injection risk).

---

## Duplicated Code

### 1. `getTasksWithSteps` vs `getDeletedTasksWithSteps`
**Files:** `lib/db/tasks.ts:4`, `lib/db/bin.ts:24`

~90% identical — both load all tasks + steps, filter by userId, join in memory, sort by date. Share a parameterized `loadTasksWithSteps(whereDeleted)` utility.

### 2. Auth page outer structure duplicated 4x
**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/forgot-password/page.tsx`, `app/(auth)/update-password/page.tsx`

All four share: centered flex layout → logo header → card container → input-with-icon patterns. Extract into a shared `AuthLayout` component.

### 3. Google Sign-In button duplicated
**Files:** `app/(auth)/login/page.tsx:113-124`, `app/(auth)/register/page.tsx:148-159`

Identical Google OAuth button with inline SVG on both login and register pages. Extract into a reusable `GoogleSignInButton` component.

### 4. API error handling is structurally identical
**Files:** `app/api/tasks/create/route.ts:36-47`, `app/api/tasks/breakdown/route.ts:36-47`

Both handle `SyntaxError` → 502, `ZodError` → 502, and generic `Error` → 500 in exactly the same way. Extract into a shared `handleAIError(error)` utility.

### 5. `BinList` and `TasksList` are structurally identical
**Files:** `components/bin/BinList.tsx`, `components/tasks-dashboard/TasksList.tsx`

Both map `TaskWithSteps[]` into `motion.div` → `STAGGER_CONTAINER` → `FADE_IN_UP` → card component. Extract shared list abstraction.

### 6. Progress calculation logic is duplicated
**Files:** `lib/db/steps.ts:20-23`, `hooks/useTaskMutations.ts:18-20`

Both `updateStepCompletionInDB()` and `updateTaskInCache()` independently compute `progress_percentage` from completed/total step counts. If the formula changes (e.g., weighted steps), both must be updated.

### 7. ConfirmDialog for sign out duplicated
**Files:** `components/ui/Sidebar.tsx`, `app/(dashboard)/profile/page.tsx`

Both instantiate `ConfirmDialog` with identical `title: "Sign Out"`, `message`, and `confirmLabel: "Sign Out"`. Extract into a reusable `SignOutDialog` component.

### 8. Input field with icon prefix repeated across auth pages
The pattern `<div class="relative"><Icon/><input/></div>` appears 8+ times across auth pages with identical class names. Extract as a shared `AuthInput` component.

---

## Additional Concerns

### 1. Empty catch block in server Supabase client
**File:** `lib/supabase/server.ts:16-20`

The `setAll` function has `try { ... } catch {}` with an empty catch block. While this is a documented Supabase pattern (it throws in middleware contexts where cookies can't be set), it silently swallows all errors, making debugging difficult if something goes wrong.

### 2. All dashboard pages are `'use client'`
**Files:** All pages under `app/(dashboard)/`

Every dashboard page is a full client component, even pages that are purely presentational (e.g., bin page with loading state). This ships more JavaScript than necessary. Sections that don't need interactivity (headers, empty states) could be server components.

### 3. No React error boundary
The app has no error boundary anywhere. If any component throws during rendering, the entire UI will unmount with no fallback UX.

### 4. No structured logging
Every error handler uses `console.error`. In production this provides no way to aggregate, filter, or alert on failures.

### 5. `useRef` bypass in auth callback prevents retries
**File:** `app/auth/callback/page.tsx:11`

The `handled.useRef()` guard prevents the callback from executing twice in StrictMode. But if the first attempt fails (network error, etc.), the ref prevents any retry — the user is stuck.

### 6. `created_at` timestamps are identical for task and steps
**File:** `lib/db/factory.ts:21,36`

All steps and the task get the same `new Date().toISOString()` value computed sequentially. This means steps have the exact same creation time as the task, which can cause sorting issues if multiple tasks are created rapidly.

### 7. Type safety: `any` cast on breakdown variables
**File:** `hooks/useTaskDetail.ts:13`

`breakdownTask.variables` is cast to `as any` to read `.stepId`. Should use the proper mutation variable type instead.

### 8. Sidebar component misnamed — it's the entire layout shell
**File:** `components/ui/Sidebar.tsx`

The `Sidebar` component renders the sidebar AND wraps `<main>{children}</main>` inside itself, making it effectively a dashboard layout wrapper rather than just a sidebar. This is misleading — callers expect a sidebar component, not the entire page shell.
