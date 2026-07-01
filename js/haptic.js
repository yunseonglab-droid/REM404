// js/haptic.js

export function createHapticController(duration) {
  let hasVibrated = false;

  function vibrateOnce() {
    if (hasVibrated) return;
    if (!("vibrate" in navigator)) return;

    navigator.vibrate(duration);
    hasVibrated = true;
  }

  function reset() {
    hasVibrated = false;
  }

  return {
    vibrateOnce,
    reset
  };
}
