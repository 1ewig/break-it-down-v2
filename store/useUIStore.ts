import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnergyLevel } from '@/types';

interface UIState {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;

  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  notificationPermission: NotificationPermission;
  setNotificationPermission: (permission: NotificationPermission) => void;

  energyLevel: EnergyLevel;
  setEnergyLevel: (level: EnergyLevel) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

      notificationsEnabled: false,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      notificationPermission: 'default',
      setNotificationPermission: (permission) => set({ notificationPermission: permission }),

      energyLevel: 'medium',
      setEnergyLevel: (level) => set({ energyLevel: level }),
    }),
    {
      name: 'break-it-down-ui-preferences',
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
        energyLevel: state.energyLevel,
      }),
    }
  )
);
