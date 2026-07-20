// js/debugLogger.js
import { reportServiceError } from "./serviceMonitor.js";

export async function logDebugError(code, detail = {}) {
  const log = {
    code,
    detail,
    status: "open",
    page: location.pathname,
    url: location.href,
    userAgent: navigator.userAgent,
    language: document.documentElement.lang || "unknown",
    version: "v0.8",
    createdAt: new Date().toISOString()
  };

  console.warn("[REM404 DEBUG]", log);
  void reportServiceError(code, {
    message: detail.message || detail.error || code,
    source: location.href,
    ...detail
  });

  try {
    const firebaseApi = await import("./firebase.js");

    if (firebaseApi && firebaseApi.saveDebugLog) {
      await firebaseApi.saveDebugLog(log);
    }
  } catch (error) {
    console.warn("Debug log save failed:", error);
  }
}
