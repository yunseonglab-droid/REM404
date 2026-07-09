# REM404 Project Context

## Project Name

REM404 Archive

---

## Current Version

**v0.7 BETA**

---

## Project Type

REM404는 단순한 웹 개발 프로젝트가 아니다.

사진예술 작업 **「남겨진 사람들의 기억과 흔적」** 을 기반으로 한  
AR / AI / Firebase 기반의 디지털 아카이브 작품이다.

이 프로젝트에서 기술은 목적이 아니라  
기억, 부재, 흔적을 경험하게 만드는 장치로 사용된다.

---

## Core Concept

REM404의 핵심 구조는 다음과 같다.

> **한 사람이 남긴 기억이 또 다른 사람의 기억으로 이어지는 디지털 아카이브**

관람객은 폐건물 사진을 AR로 인식한다.

이후 AI 이미지가 서서히 복원되고,  
관람객은 자신의 기억을 익명으로 남길 수 있다.

또한 다른 사람이 남긴 기억을 읽으며  
개인의 기억이 공동의 아카이브로 확장된다.

---

## Artistic Background

이 프로젝트는 사용자의 장기 사진 작업  
**「남겨진 사람들의 기억과 흔적」** 에서 출발한다.

주요 키워드는 다음과 같다.

- 기억
- 부재
- 흔적
- 폐건물
- 지역소멸
- 시간
- 아카이브
- AI 이미지
- 전시 경험

REM404는 폐건물을 단순히 낡은 공간으로 다루지 않는다.

사람이 떠난 뒤 남겨진 공간을  
기억이 머무는 장소로 해석한다.

---

## Experience Flow

현재 v0.7 BETA 기준 관람 흐름은 다음과 같다.

```text
AR 카메라 시작
↓
사진 이미지 타겟 인식
↓
AI 이미지 복원
↓
Recovery Sound 재생
↓
약 4초간 복원 애니메이션
↓
"당신의 기억" 버튼 등장
↓
Restore Sound 재생
↓
Archive 화면 진입
↓
익명 기억 작성
↓
저장 완료
↓
다른 사람이 남긴 기억 보기
```

---

## Sound System

v0.7 BETA부터 사운드는 역할별로 분리한다.

### Recovery Sound

```text
File: ./audio/recovery.mp3
```

사용 위치:

- AR 이미지 타겟이 인식된 후
- AI 이미지 복원 애니메이션이 시작되는 순간
- 약 4초간의 복원 경험과 함께 재생

역할:

- 기억이 복원되는 분위기 형성
- 시각적 복원과 청각적 복원을 연결

---

### Restore Sound

```text
File: ./audio/restore.mp3
```

사용 위치:

- "당신의 기억" 버튼 클릭 후
- Archive 화면으로 진입할 때

역할:

- 관람객이 아카이브 안으로 들어가는 순간을 표시
- 기억 작성 단계로 전환되는 사운드

---

## Important Sound Rule

Recovery Sound와 Restore Sound는 절대 같은 의미로 사용하지 않는다.

```text
Recovery Sound = 이미지 복원
Restore Sound = Archive 진입
```

두 사운드가 동시에 재생되면 안 된다.

---

## Current Technical Stack

- HTML
- CSS
- JavaScript ES Modules
- MindAR
- A-Frame
- Firebase Firestore
- GitHub Pages
- GitHub Release
- Firebase-based Admin Dashboard

---

## Main Files

### AR Experience

```text
ar.html
js/ar.js
js/archive.js
js/haptic.js
js/lang/language.js
js/debugLogger.js
```

### Firebase

```text
js/firebase.js
```

### Admin

```text
admin.html
debug.html
stats.html
archive-manager.html
version-history.html
```

### Styles

```text
css/style.css
css/debug.css
```

### Documentation

```text
README.md
BUILD_NOTE.md
PROJECT_CONTEXT.md
```

---

## Current Implemented Features

### User Experience

- AR image target recognition
- AI image restoration animation
- 4-second restoration timing
- Recovery Sound
- Restore Sound
- Haptic feedback
- Anonymous memory submission
- Random memory viewer
- Memory cache
- Korean / English language structure

### Admin Experience

- Admin Dashboard
- Archive Statistics
- Usage Logs
- Debug Logs
- Error Code guide
- Archive Manager
- Memory edit / delete / restore
- Recent Usage pagination
- Debug Log pagination
- Version History

---

## Admin Display Rules

Admin pages should prioritize readability.

Raw developer data should not be shown first.

Prefer this:

```text
🏠 Main Experience
✨ Memory Restored
🇰🇷 한국어
🍎 macOS
```

Instead of this:

```text
landing_visit
unknown page
ko
Mozilla/5.0...
```

JSON and full User-Agent information should only appear when necessary.

---

## Current Version Status

```text
Current Version: v0.7 BETA
Status: Stable Beta
Main Focus: Exhibition UX and system stability
```

v0.7 BETA is focused on:

- AR experience stability
- Sound role separation
- Admin readability
- Usage Log pagination
- Professor review preparation
- Exhibition usability

---

## Development Principles

### 1. Exhibition First

REM404 is an exhibition work before it is a web app.

Every technical decision should support the exhibition experience.

---

### 2. Minimal Interaction

Do not add unnecessary features.

The experience should remain quiet, direct, and focused.

---

### 3. Stability Over Expansion

If a new feature risks breaking the current experience, do not add it immediately.

Stable versions should be preserved.

---

### 4. Rollback-Friendly Development

When modifying core files, preserve the existing structure.

If a bug occurs, it should be easy to roll back.

---

### 5. Clear Versioning

Each meaningful change should be reflected in:

- Version History
- BUILD_NOTE.md
- GitHub Release

---

## Code Editing Rules

When modifying code:

1. Do not rewrite working systems unnecessarily.
2. Preserve existing function names.
3. Preserve Firebase data structure unless explicitly required.
4. Do not break existing AR recognition flow.
5. Do not break Archive memory flow.
6. Do not break Admin Dashboard flow.
7. Use small, isolated patches.
8. Add comments around new feature blocks.

Recommended comment format:

```js
// ===== Added : Feature Name =====

// code

// ===== End : Feature Name =====
```

---

## Current Risk Areas

### 1. AR Recognition Stability

Some users reported that the camera image may appear unstable while detecting the rectangular photo target.

Possible future solution:

- Add high-contrast matte border around the printed photo
- Rebuild MindAR target file
- Test with professor before applying

This should not be changed before professor review.

---

### 2. GitHub Pages Cache

GitHub Pages may serve old JavaScript files.

When needed, use cache-busting query strings:

```html
<script type="module" src="./js/ar.js?v=062-soundfix"></script>
```

This does not change the actual JavaScript file.  
It only forces the browser to reload the newest version.

---

### 3. Mobile Audio

Mobile browsers may block or delay audio playback.

Sound should only play in direct user-triggered or AR-triggered moments.

Avoid unnecessary audio unlock logic unless it causes no audible playback.

---

## Current Priority

1. Finish v0.7 BETA stabilization
2. Complete admin page pagination and readability
3. Professor demonstration
4. Collect feedback
5. Decide whether AR target design needs improvement
6. Prepare v0.7 Release
7. Move toward v0.8 / graduation version

---

## Response Preference for Future AI Assistants

When assisting with this project:

- Answer in Korean.
- Be direct and practical.
- Explain exactly where to edit.
- Provide copy-paste-ready code.
- Assume the user edits through GitHub Web Editor unless stated otherwise.
- Avoid vague explanations.
- Prioritize not breaking existing working features.
- Treat the project as an artwork, not just software.
- Keep the tone friendly but technically precise.

---

## Project Identity

REM404 should remain:

```text
Quiet
Minimal
Archival
Emotional
Technically stable
Exhibition-ready
```

It should not become:

```text
Over-designed
Game-like
SNS-like
Feature-heavy
Noisy
```

---

## Final Direction

REM404 is not about showing off AR technology.

It is about creating a situation where

> a disappeared place,
> a restored image,
> and an anonymous memory

meet inside one small digital archive.

The role of development is to protect that experience.
