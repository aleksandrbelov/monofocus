import { useState, useEffect } from 'react';

/**
 * Hook for real-time clock updates
 * Updates every second to show current time
 */
export function useRealTimeClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update immediately
    setCurrentTime(new Date());

    // Update every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentTime;
}

/**
 * Format time for iOS status bar (24-hour format)
 */
export function formatStatusBarTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
