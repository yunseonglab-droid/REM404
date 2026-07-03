// js/archive.js

export function createArchiveController({ elements, loadFirebaseApi, constants, callbacks }) {
  const {
    uiEl,
    guideEl,
    memoryBtn,
    flash,
    archiveScreen,
    archiveForm,
    archiveComplete,
    memoryInput,
    charCount,
    submitMemoryBtn,
    memoryCount,
    anonymousMemoryArea,
    viewMemoryBtn,
    sharedMemory,
    sharedMemoryText,
    memoryViewer = document.getElementById("memoryViewer"),
    nextRandomMemory = document.getElementById("nextRandomMemory")
  } = elements;

  const {
    ARCHIVE_ENTER_DELAY,
    ANONYMOUS_MEMORY_DELAY
  } = constants;

  function cameraFlash() {
    flash.style.opacity = "1";

    setTimeout(() => {
      flash.style.opacity = "0";
    }, 150);
  }

  function openArchive() {
    callbacks.setHasOpenedArchive(true);
    callbacks.clearNudgeTimer();

    cameraFlash();

    memoryBtn.classList.remove("show");
    uiEl.classList.add("fade");
    guideEl.classList.add("fade");

    setTimeout(() => {
      archiveScreen.classList.add("show");
    }, ARCHIVE_ENTER_DELAY);
  }

  function showArchiveComplete() {
    archiveForm.classList.add("hide");
    archiveComplete.classList.add("show");

    requestAnimationFrame(() => {
      archiveComplete.classList.add("visible");
    });
  }

  function showMemoryViewer() {
    if (!memoryViewer) return;

    archiveComplete.classList.remove("visible");

    setTimeout(() => {
      archiveComplete.classList.remove("show");
      memoryViewer.classList.add("show");

      requestAnimationFrame(() => {
        memoryViewer.classList.add("visible");
      });
    }, 320);
  }

  function animateCount(from, to, onComplete) {
    const displayTo = to > from ? to : from + 1;
    const duration = 1050;
    const start = performance.now();
    const countDistance = displayTo - from;

    memoryCount.style.willChange = "transform, opacity";
    memoryCount.style.transformOrigin = "center";
    memoryCount.style.transform = "translateX(0) scale(1)";
    memoryCount.style.opacity = "0.92";

    function easeOutCubic(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const value = Math.round(from + (countDistance * easedProgress));

      const pulse = Math.sin(progress * Math.PI) * 0.022;
      const tremble = Math.sin(progress * Math.PI * 18) * 0.28 * (1 - progress);

      memoryCount.textContent = value.toLocaleString();
      memoryCount.style.transform = `translateX(${tremble}px) scale(${1 + pulse})`;
      memoryCount.style.opacity = `${0.93 + (pulse * 2)}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        memoryCount.textContent = displayTo.toLocaleString();
        memoryCount.style.transform = "translateX(0) scale(1)";
        memoryCount.style.opacity = "1";
        memoryCount.style.willChange = "auto";

        if (typeof onComplete === "function") {
          onComplete();
        }
      }
    }

    requestAnimationFrame(update);
  }

  async function showRandomMemory(triggerButton = viewMemoryBtn) {
    const shouldOpenViewer = triggerButton === viewMemoryBtn;

    if (triggerButton) {
      triggerButton.disabled = true;
      triggerButton.textContent = "기억을 불러오는 중...";
    }

    if (sharedMemory) {
      sharedMemory.classList.remove("show");
    }

    const api = await loadFirebaseApi();

    if (!api || !api.getRandomMemory) {
      setTimeout(() => {
        if (sharedMemoryText) {
          sharedMemoryText.textContent = "기억을 불러오지 못했습니다.";
        }

        if (shouldOpenViewer) {
          showMemoryViewer();
        }

        if (sharedMemory) {
          sharedMemory.classList.add("show");
        }

        if (triggerButton) {
          triggerButton.textContent = triggerButton === nextRandomMemory
            ? "새로운 기억 만나기"
            : "다른 기억 보기";
          triggerButton.disabled = false;
        }
      }, 300);
      return;
    }

    try {
      const randomMemory = await api.getRandomMemory();

      setTimeout(() => {
        if (sharedMemoryText) {
          sharedMemoryText.textContent = randomMemory || "아직 공유된 기억이 없습니다.";
        }

        if (shouldOpenViewer) {
          showMemoryViewer();
        }

        if (sharedMemory) {
          sharedMemory.classList.add("show");
        }

        if (triggerButton) {
          triggerButton.textContent = triggerButton === nextRandomMemory
            ? "새로운 기억 만나기"
            : "다른 기억 보기";
          triggerButton.disabled = false;
        }
      }, 300);
    } catch (error) {
      console.error(error);

      setTimeout(() => {
        if (sharedMemoryText) {
          sharedMemoryText.textContent = "기억을 불러오지 못했습니다.";
        }

        if (shouldOpenViewer) {
          showMemoryViewer();
        }

        if (sharedMemory) {
          sharedMemory.classList.add("show");
        }

        if (triggerButton) {
          triggerButton.textContent = triggerButton === nextRandomMemory
            ? "새로운 기억 만나기"
            : "다른 기억 보기";
          triggerButton.disabled = false;
        }
      }, 300);
    }
  }

  function bindArchiveEvents() {
    memoryInput.addEventListener("input", () => {
      charCount.textContent = `${memoryInput.value.length} / 80`;
    });

    submitMemoryBtn.addEventListener("click", async () => {
      const text = memoryInput.value.trim();

      if (!text) {
        memoryInput.focus();
        return;
      }

      submitMemoryBtn.disabled = true;
      submitMemoryBtn.textContent = "기억을 저장하는 중...";

      const api = await loadFirebaseApi();

      if (!api || !api.saveMemory || !api.getMemoryCount) {
        alert("기억 저장 기능을 불러오지 못했습니다. 다시 시도해주세요.");
        submitMemoryBtn.disabled = false;
        submitMemoryBtn.textContent = "기억 남기기";
        return;
      }

      try {
        const beforeCount = await api.getMemoryCount();

        await api.saveMemory(text);

        const afterCount = await api.getMemoryCount();

        showArchiveComplete();

        animateCount(beforeCount, afterCount, () => {
          setTimeout(() => {
            anonymousMemoryArea.classList.add("show");
          }, ANONYMOUS_MEMORY_DELAY);
        });
      } catch (error) {
        console.error(error);

        alert("기억을 저장하지 못했습니다. 다시 시도해주세요.");

        submitMemoryBtn.disabled = false;
        submitMemoryBtn.textContent = "기억 남기기";
      }
    });

    viewMemoryBtn.addEventListener("click", () => {
      showRandomMemory(viewMemoryBtn);
    });

    if (nextRandomMemory) {
      nextRandomMemory.addEventListener("click", () => {
        showRandomMemory(nextRandomMemory);
      });
    }
  }

  function isArchiveOpen() {
    return archiveScreen.classList.contains("show");
  }

  return {
    bindArchiveEvents,
    openArchive,
    isArchiveOpen
  };
}
