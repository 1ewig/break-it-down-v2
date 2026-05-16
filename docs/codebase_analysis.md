# Codebase Analysis Report

## Status Legend
- ✅ **Fixed** — resolved in `fix/codebase-audit` branch, merged to master
- ⏳ **Pending** — not yet addressed

---

## Performance Bottlenecks

### 1. Loading ALL data into memory (major)
**Files:** `lib/db/tasks.ts:4-8`, `lib/db/bin.ts:24-28`
**Status:** ✅ Fixed

`getTasksWithSteps()` and `getDeletedTasksWithSteps()` now delegate to a shared `loadTasksWithSteps()` utility. Still no pagination — improvement needed long-term.

### 2. Sequential deletes in purge loop
**File:** `lib/db/bin.ts:51-54`
**Status:** ⏳ Pending

`purgeExpiredDeletedTasks()` still uses a `for` loop with individual deletes.

### 3. Missing database indexes
**File:** `lib/db/db.ts:9-12`
**Status:** ✅ Fixed

Added Dexie v2 indexes for `deleted_at`, `user_id`, `created_at`, and `is_completed`.

### 4. Redundant step loading on every completion toggle
**File:** `lib/db/steps.ts:19`
**Status:** ⏳ Pending

`updateStepCompletionInDB()` still loads ALL steps for a task to recompute progress.

### 5. Over-invalidation of queries
**File:** `hooks/useTaskMutations.ts`
**Status:** ⏳ Pending

Mutations still call `invalidateQueries` in `onSettled` despite optimistic updates in `onMutate`.

### 6. Unnecessary `(generateText as any)` type escape
**Files:** `app/api/tasks/create/route.ts:20`, `app/api/tasks/breakdown/route.ts:24`
**Status:** ✅ Fixed

Replaced with a properly typed `GenerateTextOptions` wrapper.

---

## Security Bugs

### 1. No rate limiting on auth endpoints
**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/forgot-password/page.tsx`, `app/(auth)/update-password/page.tsx`
**Status:** ⏳ Pending

No rate limiting on auth pages.

### 2. No email verification enforcement
**Status:** ⏳ Pending

App never checks `user.email_confirmed_at`.

### 3. Session staleness on client-side
**File:** `providers/AuthProvider.tsx:30-48`
**Status:** ⏳ Pending

No periodic session refresh; stale until next page reload.

### 4. Password validation is client-side only
**File:** `app/(auth)/register/page.tsx:38-41`
**Status:** ✅ Fixed (documented)

Added comments noting that Supabase project settings should enforce password strength server-side.

### 5. Duplicated Google OAuth handler (inconsistent state after error)
**Files:** `app/(auth)/login/page.tsx:33-41`, `app/(auth)/register/page.tsx:19-27`
**Status:** ⏳ Pending

No error handling if OAuth redirect fails.

### 6. No input sanitization on task title
**File:** `app/api/tasks/create/route.ts:18`
**Status:** ✅ Fixed

Added Zod schema validation — title must be a non-empty trimmed string (max 500 chars).

---

## Duplicated Code

### 1. `getTasksWithSteps` vs `getDeletedTasksWithSteps`
**Files:** `lib/db/tasks.ts:4`, `lib/db/bin.ts:24`
**Status:** ✅ Fixed

Extracted shared `loadTasksWithSteps(userId, mode)` utility in `lib/db/shared.ts`.

### 2. Auth page outer structure duplicated 4x
**Files:** `app/(auth)/login/page.tsx`, `app/(auth)/register/page.tsx`, `app/(auth)/forgot-password/page.tsx`, `app/(auth)/update-password/page.tsx`
**Status:** ⏳ Pending

Auth pages still have duplicated layout boilerplate.

### 3. Google Sign-In button duplicated
**Files:** `app/(auth)/login/page.tsx:113-124`, `app/(auth)/register/page.tsx:148-159`
**Status:** ⏳ Pending

Identical Google OAuth button with inline SVG on both pages.

### 4. API error handling is structurally identical
**Files:** `app/api/tasks/create/route.ts:36-47`, `app/api/tasks/breakdown/route.ts:36-47`
**Status:** ✅ Fixed

Extracted shared `handleAIError(error, context)` utility in `lib/ai/schemas.ts`.

### 5. `BinList` and `TasksList` are structurally identical
**Files:** `components/bin/BinList.tsx`, `components/tasks-dashboard/TasksList.tsx`
**Status:** ⏳ Pending

Both list components still share the same structure independently.

### 6. Progress calculation logic is duplicated
**Files:** `lib/db/steps.ts:20-23`, `hooks/useTaskMutations.ts:18-20`
**Status:** ⏳ Pending

Progress percentage formula still duplicated between DB layer and optimistic UI.

### 7. ConfirmDialog for sign out duplicated
**Files:** `components/ui/Sidebar.tsx`, `app/(dashboard)/profile/page.tsx`
**Status:** ⏳ Pending

Sign-out `ConfirmDialog` still duplicated across sidebar and profile page.

### 8. Input field with icon prefix repeated across auth pages
**Status:** ⏳ Pending

`<div class="relative"><Icon/><input/></div>` pattern still inline 8+ times.

---

## Additional Concerns

### 1. Empty catch block in server Supabase client
**File:** `lib/supabase/server.ts:16-20`
**Status:** ✅ Fixed (documented)

Added comment explaining why the catch is empty.

### 2. All dashboard pages are `'use client'`
**Files:** All pages under `app/(dashboard)/`
**Status:** ⏳ Pending

All dashboard pages still ship as full client components.

### 3. No React error boundary
**Status:** ⏳ Pending

App has no error boundary; any render crash unmounts the entire UI.

### 4. No structured logging
**Status:** ⏳ Pending

All errors logged via `console.error` with no aggregation.

### 5. `useRef` bypass in auth callback prevents retries
**File:** `app/auth/callback/page.tsx:11`
**Status:** ⏳ Pending

If first callback attempt fails, the ref prevents any retry.

### 6. `created_at` timestamps are identical for task and steps
**File:** `lib/db/factory.ts:21,36`
**Status:** ⏳ Pending

Steps get the same timestamp as the parent task.

### 7. Type safety: `any` cast on breakdown variables
**File:** `hooks/useTaskDetail.ts:13`
**Status:** ✅ Fixed

Replaced `as any` with `breakdownTask.variables?.stepId ?? null`.

### 8. Sidebar component misnamed — it's the entire layout shell
**File:** `components/ui/Sidebar.tsx`
**Status:** ⏳ Pending

Sidebar still doubles as the dashboard layout wrapper.
