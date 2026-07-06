// js/debug.js

const DEBUG_STORAGE_KEY = "rem404DebugLogs";
const MAX_LOCAL_LOGS = 50;

function getLocalLogs() {
  try {
    return JSON.parse(localStorage.getItem(DEBUG_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveLocalLog(log) {
  try {
    const logs = getLocalLogs();
    logs.unshift(log);

    localStorage.setItem(
      DEBUG_STORAGE_KEY,
      JSON.stringify(logs.slice(0, MAX_LOCAL_LOGS))
    );
  } catch (error) {
    console.warn("Local debug log save failed:", error);
  }
}

export async function logDebugError(code, detail = {}) {
  const log = {
    code,
    detail,
    page: location.pathname,
    url: location.href,
    userAgent: navigator.userAgent,
    language: document.documentElement.lang || "unknown",
    createdAt: new Date().toISOString()
  };

  console.warn("[REM404 DEBUG]", log);

  saveLocalLog(log);

  try {
    const firebaseApi = await import("./firebase.js");

    if (firebaseApi && firebaseApi.saveDebugLog) {
      await firebaseApi.saveDebugLog(log);
    }
  } catch (error) {
    console.warn("Remote debug log save failed:", error);
  }
}

export function getDebugLogs() {
  return getLocalLogs();
}
