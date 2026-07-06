// js/stats.js

import { getArchiveStats } from "./firebase.js";

const totalMemoriesEl = document.getElementById("totalMemories");
const koCountEl = document.getElementById("koCount");
const enCountEl = document.getElementById("enCount");
const unknownCountEl = document.getElementById("unknownCount");
const usageCountEl = document.getElementById("usageCount");
const usageListEl = document.getElementById("usageList");
const refreshStatsBtn = document.getElementById("refreshStatsBtn");

function formatDate(value) {
  if (!value) return "Unknown time";

  if (value.toDate) {
    return value.toDate().toLocaleString("ko-KR");
  }

  return String(value);
}

function renderStats(stats) {
  totalMemoriesEl.textContent = stats.totalMemories ?? 0;
  koCountEl.textContent = stats.language?.ko ?? 0;
  enCountEl.textContent = stats.language?.en ?? 0;
  unknownCountEl.textContent = stats.language?.unknown ?? 0;
  usageCountEl.textContent = stats.totalVisits ?? stats.usageLogs?.length ?? 0;

  const usageLogs = stats.usageLogs || [];

  if (usageLogs.length === 0) {
    usageListEl.innerHTML = `
      <div class="empty">
        아직 사용 기록이 없습니다.
      </div>
    `;
    return;
  }

  usageListEl.innerHTML = usageLogs.map((log) => {
    return `
      <article class="log-card">
        <div class="log-top">
          <div class="log-code">${log.type || "visit"}</div>
          <div class="badge open">LOG</div>
        </div>

        <div class="log-title">
          ${log.page || "unknown page"}
        </div>

        <div class="log-detail">
${JSON.stringify(log.detail || {}, null, 2)}
        </div>

        <div class="log-meta">
          Time: ${formatDate(log.createdAt)}<br>
          Language: ${log.language || "unknown"}<br>
          Device: ${log.userAgent || "unknown"}
        </div>
      </article>
    `;
  }).join("");
}

async function loadStats() {
  if (refreshStatsBtn) {
    refreshStatsBtn.disabled = true;
    refreshStatsBtn.textContent = "불러오는 중...";
  }

  try {
    const stats = await getArchiveStats();
    renderStats(stats);
  } catch (error) {
    console.error(error);

    usageListEl.innerHTML = `
      <div class="empty">
        통계 정보를 불러오지 못했습니다.<br>
        Firebase 연결을 확인해주세요.
      </div>
    `;
  } finally {
    if (refreshStatsBtn) {
      refreshStatsBtn.disabled = false;
      refreshStatsBtn.textContent = "새로고침";
    }
  }
}

if (refreshStatsBtn) {
  refreshStatsBtn.addEventListener("click", loadStats);
}

loadStats();
