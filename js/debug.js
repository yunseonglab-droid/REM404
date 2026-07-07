// js/debug.js

import { getDebugLogs } from "./firebase.js";
const ERROR_GUIDE = {
  "REM404-E-MIND-002": {
    title: "이미지 인식 실패",
    description: "이미지 타겟이 15초 이상 인식되지 않았습니다.",
    cause: "사진이 카메라 화면 안에 없거나, 조명·반사·거리 문제로 인식되지 않았을 수 있습니다.",
    solution: "사진을 화면 중앙에 맞추고, 반사를 줄인 뒤 다시 스캔하세요."
  },

  "REM404-E-MIND-START": {
    title: "AR 카메라 시작 실패",
    description: "MindAR 또는 카메라 권한 요청 과정에서 오류가 발생했습니다.",
    cause: "카메라 권한 거부, Safari 권한 지연, 브라우저 호환성 문제가 원인일 수 있습니다.",
    solution: "카메라 권한을 허용하고, 새로고침 후 다시 시도하세요."
  },

  "REM404-E-FIRE-001": {
    title: "Firebase 연결 실패",
    description: "Firebase 모듈을 불러오지 못했습니다.",
    cause: "인터넷 연결 문제, Firebase 설정 문제, 또는 모듈 로딩 실패일 수 있습니다.",
    solution: "네트워크 상태와 Firebase 설정을 확인하세요."
  },

  "REM404-E-AUDIO-001": {
    title: "효과음 재생 실패",
    description: "복원 효과음을 재생하지 못했습니다.",
    cause: "브라우저 자동재생 제한 또는 오디오 파일 로딩 실패일 수 있습니다.",
    solution: "사용자 터치 후 다시 실행하거나 audio 파일 경로를 확인하세요."
  }
};
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
    const guide = ERROR_GUIDE[log.code];

const guideHtml = guide
  ? `
    <div class="error-guide">
      <div class="error-guide-title">${guide.title}</div>
      <div class="error-guide-desc">${guide.description}</div>

      <div class="error-guide-row">
        <strong>가능한 원인</strong>
        <span>${guide.cause}</span>
      </div>

      <div class="error-guide-row">
        <strong>해결 방법</strong>
        <span>${guide.solution}</span>
      </div>
    </div>
  `
  : "";

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

          ${guideHtml}

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
