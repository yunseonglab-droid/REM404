// js/debug.js

import { getDebugLogs } from "./firebase.js";

const openCountEl = document.getElementById("openCount");
const solvedCountEl = document.getElementById("solvedCount");
const totalCountEl = document.getElementById("totalCount");
const logListEl = document.getElementById("logList");
const refreshBtn = document.getElementById("refreshBtn");

function formatDate(value) {
  if (!value) return "Unknown time";

  if (value.toDate) {
    return value.toDate().toLocaleString("ko-KR");
  }

  return String(value);
}

function normalizeLog(log) {
  return {
    code: log.code || "REM404-E-UNKNOWN",
    title: log.title || log.detail?.message || "Unknown Error",
    detail: log.detail || {},
    status: log.status || "open",
    page: log.page || "unknown",
    userAgent: log.userAgent || "unknown",
    createdAt: log.createdAtServer || log.createdAt || null
  };
}

function renderLogs(logs) {
  const normalizedLogs = logs.map(normalizeLog);

  const openLogs = normalizedLogs.filter((log) => log.status === "open");
  const solvedLogs = normalizedLogs.filter((log) => log.status === "solved");

  openCountEl.textContent = openLogs.length;
  solvedCountEl.textContent = solvedLogs.length;
  totalCountEl.textContent = normalizedLogs.length;

  if (normalizedLogs.length === 0) {
    logListEl.innerHTML = `
      <div class="empty">
        아직 기록된 오류가 없습니다.
      </div>
    `;
    return;
  }

  logListEl.innerHTML = normalizedLogs.map((log) => {
    const detailText = JSON.stringify(log.detail, null, 2);

    return `
      <article class="log-card">
        <div class="log-top">
          <div class="log-code">${log.code}</div>
          <div class="badge ${log.status}">
            ${log.status.toUpperCase()}
          </div>
        </div>

        <div class="log-title">
          ${log.title}
        </div>

        <div class="log-detail">${detailText}</div>

        <div class="log-meta">
          Page: ${log.page}<br>
          Time: ${formatDate(log.createdAt)}<br>
          Device: ${log.userAgent}
        </div>
      </article>
    `;
  }).join("");
}

async function loadLogs() {
  if (refreshBtn) {
    refreshBtn.disabled = true;
    refreshBtn.textContent = "불러오는 중...";
  }

  try {
    const logs = await getDebugLogs();
    renderLogs(logs);
  } catch (error) {
    console.error(error);

    logListEl.innerHTML = `
      <div class="empty">
        오류 기록을 불러오지 못했습니다.<br>
        Firebase 연결을 확인해주세요.
      </div>
    `;
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      refreshBtn.textContent = "새로고침";
    }
  }
}

if (refreshBtn) {
  refreshBtn.addEventListener("click", loadLogs);
}

loadLogs();
