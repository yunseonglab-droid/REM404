// js/ar.js

import { createArchiveController } from "./archive.js";
import { createHapticController } from "./haptic.js";

const statusEl = document.getElementById("status");
const subEl = document.getElementById("sub");
const uiEl = document.getElementById("ui");
const reflectionCard = document.getElementById("reflectionCard");
const guideEl = document.getElementById("guide");
const loadingText = document.getElementById("loadingText");

const target = document.getElementById("target");
const overlay = document.getElementById("aiOverlay");
const memoryBtn = document.getElementById("memoryBtn");
const flash = document.getElementById("flash");

const archiveScreen = document.getElementById("archiveScreen");
const archiveForm = document.getElementById("archiveForm");
const archiveComplete = document.getElementById("archiveComplete");
const memoryInput = document.getElementById("memoryInput");
const charCount = document.getElementById("charCount");
const submitMemoryBtn = document.getElementById("submitMemoryBtn");
const memoryCount = document.getElementById("memoryCount");
const anonymousMemoryArea = document.getElementById("anonymousMemoryArea");
const viewMemoryBtn = document.getElementById("viewMemoryBtn");
const sharedMemory = document.getElementById("sharedMemory");
const sharedMemoryText = document.getElementById("sharedMemoryText");

const FAST_REVEAL_DURATION = 820;
const SLOW_REVEAL_DURATION = 2700;
const INITIAL_RENDER_OPACITY = 0.4;
const MID_BLUR = 5;
const MAX_BLUR = 10;

const GUIDE_SWAP_DELAY = 3000;
const REFLECTION_HINT_DELAY = 9000;
const BUTTON_NUDGE_TIME = 10000;
const ARCHIVE_ENTER_DELAY = 120;
const RECOGNITION_STABLE_DELAY = 180;
const RECOGNITION_FEEDBACK_DURATION = 400;
const RECOGNITION_HAPTIC_DURATION = 25;
const RECOVERY_COMPLETE_DELAY = 500;
const ANONYMOUS_MEMORY_DELAY = 300;

const INITIAL_STATUS_TEXT = "사진을 사각형 안에<br>맞춰주세요.";
const INITIAL_SUB_TEXT = "사진 전체가 사각형 안에<br>들어오도록 맞춰주세요.";

let animationFrame = null;
let startTime = null;
let isImageReady = false;
let hasOpenedArchive = false;
let foundOnce = false;
let isTargetActive = false;

let guideSwapTimer = null;
let reflectionHintTimer = null;
let nudgeTimer = null;
let uiFadeTimer = null;
let guideFadeTimer = null;
let recognitionStableTimer = null;
let recognitionRevealTimer = null;
let recoveryCompleteTimer = null;

let firebaseApi = null;

const haptic = createHapticController(RECOGNITION_HAPTIC_DURATION);

const archive = createArchiveController({
  elements: {
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
    sharedMemoryText
  },
  loadFirebaseApi,
  constants: {
    ARCHIVE_ENTER_DELAY,
    ANONYMOUS_MEMORY_DELAY
  },
  callbacks: {
    setHasOpenedArchive(value) {
      hasOpenedArchive = value;
    },
    clearNudgeTimer() {
      clearTimeout(nudgeTimer);
    }
  }
});

async function loadFirebaseApi() {
  if (firebaseApi) return firebaseApi;

  try {
    firebaseApi = await import("./firebase.js");
    return firebaseApi;
  } catch (error) {
    console.error("Firebase module load failed:", error);
    return null;
  }
}

function easeOutMemory(value) {
  return 1 - Math.pow(1 - value, 3);
}

function setInstruction(mainText, subHtml) {
  statusEl.innerHTML = mainText;
  subEl.innerHTML = subHtml;
}

function resetRecognitionText() {
  statusEl.innerHTML = INITIAL_STATUS_TEXT;
  subEl.innerHTML = INITIAL_SUB_TEXT;
}

function showInitialRecognitionUI() {
  resetRecognitionText();

  uiEl.classList.remove("fade");
  statusEl.classList.remove("is-hidden");
  subEl.classList.remove("is-visible");

  hideReflectionCard();
  hideLoadingText();
}

function showSecondaryGuide() {
  if (isTargetActive || foundOnce || hasOpenedArchive) return;

  statusEl.classList.add("is-hidden");
  subEl.classList.add("is-visible");
}

function showReflectionCard() {
  if (isTargetActive || foundOnce || hasOpenedArchive || isImageReady) return;
  if (!reflectionCard) return;

  reflectionCard.classList.add("is-visible");
}

function hideReflectionCard() {
  if (!reflectionCard) return;

  reflectionCard.classList.remove("is-visible");
}

function showLoadingText() {
  loadingText.classList.remove("hide");
}

function hideLoadingText() {
  loadingText.classList.add("hide");
}

function setOpacity(value) {
  overlay.setAttribute("material", "opacity", value);
}

function setCanvasBlur(value) {
  const canvas = document.querySelector("canvas");
  if (canvas) canvas.style.filter = `blur(${value}px)`;
}

function clearHintTimers() {
  clearTimeout(guideSwapTimer);
  clearTimeout(reflectionHintTimer);
}

function clearRecognitionTimers() {
  clearTimeout(recognitionStableTimer);
  clearTimeout(recognitionRevealTimer);
}

function clearUiTimers() {
  clearTimeout(uiFadeTimer);
  clearTimeout(guideFadeTimer);
}

function clearMemoryFlowTimers() {
  clearTimeout(nudgeTimer);
  clearTimeout(recoveryCompleteTimer);
}

function clearAllTimers() {
  clearHintTimers();
  clearRecognitionTimers();
  clearUiTimers();
  clearMemoryFlowTimers();
}

function stopFade() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = null;
  startTime = null;
  setOpacity(0);
  setCanvasBlur(0);
}

function resetMemoryButton() {
  isImageReady = false;
  hasOpenedArchive = false;
  memoryBtn.textContent = "기억 남기기";
  memoryBtn.classList.remove("show");
  memoryBtn.classList.remove("nudge");
}

function nudgeMemoryButton() {
  if (!isImageReady || hasOpenedArchive) return;
  memoryBtn.classList.remove("nudge");
  void memoryBtn.offsetWidth;
  memoryBtn.classList.add("nudge");
}

function showMemoryButton() {
  hideReflectionCard();
  hideLoadingText();

  recoveryCompleteTimer = setTimeout(() => {
    if (!isTargetActive || hasOpenedArchive) return;

    hideReflectionCard();

    isImageReady = true;
    hasOpenedArchive = false;
    memoryBtn.textContent = "기억 남기기";
    memoryBtn.classList.add("show");

    nudgeTimer = setTimeout(() => {
      nudgeMemoryButton();
    }, BUTTON_NUDGE_TIME);
  }, RECOVERY_COMPLETE_DELAY);
}

function startFailHints() {
  clearHintTimers();

  guideSwapTimer = setTimeout(() => {
    showSecondaryGuide();
  }, GUIDE_SWAP_DELAY);

  reflectionHintTimer = setTimeout(() => {
    showReflectionCard();
  }, REFLECTION_HINT_DELAY);
}

function stopFailHints() {
  clearHintTimers();
}

function fadeInstructionLater() {
  uiFadeTimer = setTimeout(() => {
    uiEl.classList.add("fade");
  }, 5000);

  guideFadeTimer = setTimeout(() => {
    guideEl.classList.add("fade");
  }, 7500);
}

function startFade() {
  stopFade();
  resetMemoryButton();

  startTime = performance.now();

  function animate(now) {
    const elapsed = now - startTime;
    const slowStartTime = FAST_REVEAL_DURATION;
    const totalDuration = FAST_REVEAL_DURATION + SLOW_REVEAL_DURATION;

    let opacity;
    let blurAmount;

    if (elapsed <= slowStartTime) {
      const fastProgress = Math.min(elapsed / FAST_REVEAL_DURATION, 1);
      const easedFastProgress = easeOutMemory(fastProgress);

      opacity = INITIAL_RENDER_OPACITY * easedFastProgress;
      blurAmount = MAX_BLUR - ((MAX_BLUR - MID_BLUR) * easedFastProgress);
    } else {
      const slowProgress = Math.min((elapsed - slowStartTime) / SLOW_REVEAL_DURATION, 1);
      const easedSlowProgress = easeOutMemory(slowProgress);

      opacity = INITIAL_RENDER_OPACITY + ((1 - INITIAL_RENDER_OPACITY) * easedSlowProgress);
      blurAmount = MID_BLUR * (1 - easedSlowProgress);
    }

    setOpacity(Math.min(opacity, 1));
    setCanvasBlur(Math.max(0, blurAmount));

    if (elapsed < totalDuration) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      setOpacity(1);
      setCanvasBlur(0);
      showMemoryButton();
    }
  }

  animationFrame = requestAnimationFrame(animate);
}

function handleTargetFound() {
  if (isTargetActive) return;

  isTargetActive = true;
  foundOnce = true;

  stopFailHints();
  clearRecognitionTimers();
  clearUiTimers();

  resetRecognitionText();
  statusEl.classList.remove("is-hidden");
  subEl.classList.remove("is-visible");
  hideReflectionCard();

  uiEl.classList.add("fade");
  showLoadingText();

  recognitionStableTimer = setTimeout(() => {
    if (!isTargetActive) return;

    haptic.vibrateOnce();

    recognitionRevealTimer = setTimeout(() => {
      if (!isTargetActive) return;

      startFade();
      fadeInstructionLater();
    }, RECOGNITION_FEEDBACK_DURATION);
  }, RECOGNITION_STABLE_DELAY);
}

function handleTargetLost() {
  if (archive.isArchiveOpen()) return;

  isTargetActive = false;
  foundOnce = false;
  haptic.reset();
  clearAllTimers();

  showInitialRecognitionUI();

  guideEl.classList.remove("fade");

  resetMemoryButton();
  stopFade();
  startFailHints();
}

window.addEventListener("load", () => {
  foundOnce = false;
  showInitialRecognitionUI();
  startFailHints();
  loadFirebaseApi();
});

target.addEventListener("targetFound", () => {
  handleTargetFound();
});

target.addEventListener("targetLost", () => {
  handleTargetLost();
});

memoryBtn.addEventListener("click", () => {
  if (!isImageReady || hasOpenedArchive) return;

  hideReflectionCard();
  uiEl.classList.add("fade");

  archive.openArchive();
});

archive.bindArchiveEvents();
