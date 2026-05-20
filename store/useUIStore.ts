import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EnergyLevel } from '@/types';

interface UIState {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;

  userName: string;
  setUserName: (name: string) => void;

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

      userName: '',
      setUserName: (name) => set({ userName: name }),

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
        userName: state.userName,
        notificationsEnabled: state.notificationsEnabled,
        energyLevel: state.energyLevel,
      }),
    }
  )
);
