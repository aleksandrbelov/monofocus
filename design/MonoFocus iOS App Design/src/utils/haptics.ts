/**
 * Haptic Feedback Utilities for iOS
 * Provides standardized haptic feedback patterns
 */

export type HapticType = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'warning' 
  | 'error'
  | 'selection';

/**
 * Trigger haptic feedback
 * Falls back gracefully on unsupported devices
 */
export const triggerHaptic = (type: HapticType = 'light') => {
  // Check if the Haptic API is available
  if (!('vibrate' in navigator)) {
    return;
  }

  // Map haptic types to vibration patterns
  const patterns: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    warning: [20, 100, 20],
    error: [50, 100, 50, 100, 50],
    selection: 5,
  };

  try {
    navigator.vibrate(patterns[type]);
  } catch (e) {
    // Silently fail if vibration is not supported
    console.debug('Haptic feedback not supported:', e);
  }
};

/**
 * Specific haptic feedback functions for common interactions
 */
export const haptics = {
  // Button interactions
  buttonPress: () => triggerHaptic('medium'),
  buttonLight: () => triggerHaptic('light'),
  
  // Selection changes
  selection: () => triggerHaptic('selection'),
  
  // Timer events
  timerStart: () => triggerHaptic('medium'),
  timerPause: () => triggerHaptic('light'),
  timerStop: () => triggerHaptic('heavy'),
  timerComplete: () => triggerHaptic('success'),
  
  // Notifications
  success: () => triggerHaptic('success'),
  warning: () => triggerHaptic('warning'),
  error: () => triggerHaptic('error'),
  
  // UI interactions
  toggleOn: () => triggerHaptic('medium'),
  toggleOff: () => triggerHaptic('light'),
  modalOpen: () => triggerHaptic('light'),
  modalClose: () => triggerHaptic('light'),
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in navigator;
};
