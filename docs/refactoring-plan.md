# Codebase Refactoring Plan

This document outlines a multi-phase plan to address codebase inconsistencies, improve type safety, and clean up unused code.

---

## Phase 1: Type Safety Fixes (High Priority)

### 1.1 Fix `StepItem` Type
**File**: `@/components/task-details/StepItem.tsx:11`

**Issue**: The `step` prop is typed as `any` instead of the proper `Step` type.

**Change**:
```typescript
// Before
interface StepItemProps {
  step: any;
  // ...
}

// After
import { Step } from '@/types';

interface StepItemProps {
  step: Step;
  // ...
}
```

**Impact**: Improves type safety and enables better IDE autocomplete/error detection.

---

## Phase 2: Data Fetching Optimization (High Priority)

### 2.1 Create `useTaskQuery` Hook
**File**: `@/hooks/useTasksQuery.ts`

**Issue**: The task detail page fetches ALL tasks then filters client-side, which is inefficient.

**Change**: Add a new hook for single-task fetching:
```typescript
export function useTaskQuery(taskId: string) {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: async () => {
      return getTaskWithSteps(taskId);
    },
    enabled: !!taskId,
  });
}
```

### 2.2 Update Task Detail Page
**File**: `@/app/(dashboard)/tasks/[id]/page.tsx:18`

**Change**: Replace the inefficient all-tasks fetch with single-task query:
```typescript
// Before
const { data: tasks = [], isLoading } = useTasksQuery();
const task = tasks.find(t => t.id === id);

// After
const { data: task, isLoading } = useTaskQuery(id);
```

**Impact**: Reduces data transfer, improves performance, and simplifies the component logic.

---

## Phase 3: Remove Dead Code (Medium Priority)

### 3.1 Decide on `useHomeForm` Hook
**Files**: `@/hooks/useHomeForm.ts` and `@/app/(dashboard)/home/page.tsx:12-28`

**Issue**: The `useHomeForm` hook exists but is never used. The home page duplicates its logic inline.

**Options**:
- **Option A**: Delete `@/hooks/useHomeForm.ts` and keep inline logic
- **Option B**: Refactor home page to use the hook

**Recommendation**: Option B - Use the hook for better separation of concerns.

**Change**:
```typescript
// In @/app/(dashboard)/home/page.tsx
// Replace lines 12-28 with:
const { taskTitle, setTaskTitle, handleSubmit, isPending, canSubmit } = useHomeForm();
```

**Impact**: Improves code reusability and testability.

---

## Phase 4: Unify Persistence Strategy (Medium Priority)

### 4.1 Move Notification State to Zustand
**Files**: `@/hooks/useNotifications.ts` and `@/store/useUIStore.ts`

**Issue**: Two different persistence strategies (Zustand persist vs manual localStorage) for similar concerns.

**Change**: Extend the Zustand store to include notification state:
```typescript
// In @/store/useUIStore.ts
interface UIState {
  // ... existing state
  notificationsEnabled: boolean;
  notificationPermission: NotificationPermission;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationPermission: (permission: NotificationPermission) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // ... existing state
      notificationsEnabled: false,
      notificationPermission: 'default',
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setNotificationPermission: (permission) => set({ notificationPermission: permission }),
    }),
    {
      name: 'break-it-down-ui-preferences',
      partialize: (state) => ({
        userName: state.userName,
        notificationsEnabled: state.notificationsEnabled,
      }),
    }
  )
);
```

### 4.2 Refactor `useNotifications` Hook
**Change**: Simplify to use the Zustand store:
```typescript
export function useNotifications() {
  const { 
    notificationsEnabled, 
    setNotificationsEnabled, 
    notificationPermission,
    setNotificationPermission 
  } = useUIStore();

  const toggle = async () => {
    // ... logic using store setters
  };

  return { enabled: notificationsEnabled, permission: notificationPermission, toggle };
}
```

**Impact**: Consistent persistence strategy, cleaner code, easier state management.

---

## Phase 5: Remove Unused Dependencies (Low Priority)

### 5.1 Remove Unused Packages
**File**: `package.json`

**Packages to remove**:
- `@supabase/supabase-js` - never used in codebase
- `groq-sdk` - redundant with `@ai-sdk/groq`
- `uuid` - IDs are generated with `Date.now()` strings
- `dotenv` - Next.js handles `.env*` files natively

**Change**:
```bash
npm uninstall @supabase/supabase-js groq-sdk uuid dotenv
```

**Impact**: Reduces bundle size and dependency maintenance burden.

---

## Phase 6: Clean Up Unused Types and Stubs (Low Priority)

### 6.1 Remove or Implement `Conversation` Type
**File**: `@/types/index.ts:1-7`

**Issue**: `Conversation` type exists but is never referenced.

**Options**:
- **Option A**: Remove the type if it's not planned for use
- **Option B**: Implement conversation features

**Recommendation**: Remove unless conversation features are planned.

### 6.2 Implement or Remove Auth Stubs
**Files**: `@/app/(auth)/login/page.tsx` and `@/app/(auth)/register/page.tsx`

**Issue**: Auth pages are stubs with no functionality.

**Options**:
- **Option A**: Remove auth routes if authentication is not needed
- **Option B**: Implement authentication (e.g., with Convex as planned)

**Recommendation**: Implement authentication when integrating Convex (already planned).

### 6.3 Remove Hardcoded `user_id`
**File**: `@/lib/db/indexedDB.ts:351`

**Issue**: `user_id: 'anonymous'` is hardcoded and never varies.

**Change**: Either remove the field (if not needed) or implement user authentication to populate it dynamically.

**Impact**: Cleaner data model or proper user association.

---

## Phase 7: Add Consistent `'use client'` Directives (Low Priority)

### 7.1 Add Missing Directives
**Files**:
- `@/hooks/useHomeForm.ts`
- `@/hooks/useTaskMutations.ts`
- `@/hooks/useTasksQuery.ts`
- `@/components/tasks-dashboard/TaskCard.tsx`

**Change**: Add `'use client';` at the top of each file that uses React hooks or client-side features.

**Impact**: Explicit client component markers, better Next.js optimization.

---

## Execution Order

1. **Phase 1** - Type safety (quick win, no breaking changes)
2. **Phase 2** - Performance optimization (high impact)
3. **Phase 3** - Code organization
4. **Phase 4** - State management consistency
5. **Phase 5** - Dependency cleanup
6. **Phase 6** - Type/stub cleanup
7. **Phase 7** - Directive consistency

---

## Notes

- Each phase should be tested independently before proceeding to the next
- Run `npm run build` after each phase to catch any TypeScript errors
- Consider creating a git branch for each phase for easy rollback
