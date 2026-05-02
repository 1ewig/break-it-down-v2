import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar state (Mobile Drawer)
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;

  // Persisted Preferences
  isGentleMode: boolean;
  toggleGentleMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      isGentleMode: true,
      toggleGentleMode: () => set((state) => ({ isGentleMode: !state.isGentleMode })),
    }),
    {
      name: 'break-it-down-ui-preferences',
      // Only persist the user preferences, not transient UI state like sidebar or loading
      partialize: (state) => ({ isGentleMode: state.isGentleMode }),
    }
  )
);
