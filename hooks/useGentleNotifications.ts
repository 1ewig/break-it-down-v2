'use client';

import { useState, useEffect } from 'react';

export function useGentleNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      setEnabled(localStorage.getItem('gentle_notifications') === 'true');
    }
  }, []);

  const toggle = async () => {
    if (!('Notification' in window)) return;
    
    if (!enabled && permission !== 'granted') {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setEnabled(true);
        localStorage.setItem('gentle_notifications', 'true');
        // Example gentle notification
        new Notification("Take your time", { 
          body: "Gentle nudges are enabled. You can rest whenever you need.", 
          icon: "/favicon.ico" 
        });
      }
    } else {
      const newState = !enabled;
      setEnabled(newState);
      localStorage.setItem('gentle_notifications', String(newState));
    }
  };

  return { enabled, permission, toggle };
}
