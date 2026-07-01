// js/ar.js

import { createArchiveController } from "./archive.js";
import { createHapticController } from "./haptic.js";

/*
  기존 ar.js 전체 로직은 유지합니다.
  확인할 핵심은 아래 흐름입니다.
*/

const RECOGNITION_STABLE_DELAY = 180;
const RECOGNITION_HAPTIC_DURATION = 25;

const haptic = createHapticController(RECOGNITION_HAPTIC_DURATION);

/*
  handleTargetFound 내부는 아래 구조를 유지해야 합니다.
*/

function handleTargetFound() {
  if (isTargetActive) return;

  isTargetActive = true;
  foundOnce = true;

  stopFailHints();
  clearRecognitionTimers();
  clearUiTimers();

  hideIntroUI();

  recognitionStableTimer = setTimeout(() => {
    if (!isTargetActive) return;

    haptic.vibrateOnce();

    setInstruction(
      "기억을 찾았습니다.",
      "잠시 후 기억을 복원합니다."
    );

    recognitionRevealTimer = setTimeout(() => {
      if (!isTargetActive) return;

      startFade();
      fadeInstructionLater();
    }, RECOGNITION_FEEDBACK_DURATION);
  }, RECOGNITION_STABLE_DELAY);
}

/*
  handleTargetLost 내부도 아래 reset을 유지해야 합니다.
*/

function handleTargetLost() {
  if (archive.isArchiveOpen()) return;

  isTargetActive = false;
  foundOnce = false;
  haptic.reset();
  clearAllTimers();

  setInstruction(
    "전시 사진을 다시 비춰주세요.",
    "사진 전체가 사각형 안에 들어오도록<br>거리와 빛 반사를 조정해보세요."
  );

  uiEl.classList.remove("fade");
  guideEl.classList.remove("fade");
  loadingText.classList.remove("hide");

  resetMemoryButton();
  stopFade();
  startFailHints();
}
