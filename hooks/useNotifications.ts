'use client';

import { useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';

export function useNotifications() {
  const {
    notificationsEnabled,
    setNotificationsEnabled,
    notificationPermission,
    setNotificationPermission,
  } = useUIStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [setNotificationPermission]);

  const toggle = async () => {
    if (!('Notification' in window)) return;

    if (!notificationsEnabled && notificationPermission !== 'granted') {
      const result = await Notification.requestPermission();
      setNotificationPermission(result);
      if (result === 'granted') {
        setNotificationsEnabled(true);
        new Notification("Take your time", {
          body: "Gentle nudges are enabled. You can rest whenever you need.",
          icon: "/favicon.ico"
        });
      }
    } else {
      const newState = !notificationsEnabled;
      setNotificationsEnabled(newState);
    }
  };

  return { enabled: notificationsEnabled, permission: notificationPermission, toggle };
}