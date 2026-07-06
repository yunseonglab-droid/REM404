import {
  getAllMemories,
  updateMemory,
  deleteMemory
} from "./firebase.js";

const memoryList = document.getElementById("memoryList");
const refreshBtn = document.getElementById("refreshMemoriesBtn");
const searchInput = document.getElementById("memorySearchInput");

let memories = [];

function formatDate(value) {
  if (!value) return "-";

  if (value.toDate) {
    return value.toDate().toLocaleString("ko-KR");
  }

  return String(value);
}

function render(list) {

  if (list.length === 0) {
    memoryList.innerHTML = `
      <div class="empty">
        저장된 기억이 없습니다.
      </div>
    `;
    return;
  }

  memoryList.innerHTML = list.map(memory => `
    <article class="log-card">

      <div class="log-top">
        <div class="log-code">${memory.id}</div>
        <div class="badge open">
          ${(memory.language || "unknown").toUpperCase()}
        </div>
      </div>

      <textarea
        class="memory-editor"
        data-id="${memory.id}"
        maxlength="80"
      >${memory.memory || ""}</textarea>

      <div class="log-meta">
        ${formatDate(memory.createdAt)}
      </div>

      <div class="manager-buttons">

        <button
          class="edit-memory-btn"
          data-id="${memory.id}">
          저장
        </button>

        <button
          class="delete-memory-btn"
          data-id="${memory.id}">
          삭제
        </button>

      </div>

    </article>
  `).join("");

  bindButtons();
}

function bindButtons() {

  document.querySelectorAll(".edit-memory-btn")
    .forEach(button => {

      button.onclick = async () => {

        const id = button.dataset.id;

        const textarea = document.querySelector(
          `.memory-editor[data-id="${id}"]`
        );

        await updateMemory(id, textarea.value);

        alert("수정되었습니다.");

      };

    });

  document.querySelectorAll(".delete-memory-btn")
    .forEach(button => {

      button.onclick = async () => {

        if (!confirm("정말 삭제하시겠습니까?")) return;

        await deleteMemory(button.dataset.id);

        loadMemories();

      };

    });

}

async function loadMemories() {

  memoryList.innerHTML = `
    <div class="empty">
      불러오는 중...
    </div>
  `;

  memories = await getAllMemories();

  render(memories);

}

searchInput.addEventListener("input", () => {

  const keyword = searchInput.value
    .trim()
    .toLowerCase();

  const filtered = memories.filter(memory => {

    return (memory.memory || "")
      .toLowerCase()
      .includes(keyword);

  });

  render(filtered);

});

refreshBtn.addEventListener("click", loadMemories);

loadMemories();
