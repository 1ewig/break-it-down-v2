import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Sidebar state (Mobile Drawer)
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleSidebar: () => void;

  // User Preferences
  userName: string;
  setUserName: (name: string) => void;

  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  notificationPermission: NotificationPermission;
  setNotificationPermission: (permission: NotificationPermission) => void;
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
