# REM404 Archive Project Log

**Developer:** 엄윤성  
**Project:** REM404 Archive

---

# v0.1 — Project Beginning

## Initial Prototype

### 목표
AI가 복원한 폐건물을 AR로 보여주는 가장 기본적인 프로토타입 제작.

### 구현
- MindAR 적용
- 이미지 타겟 인식
- AI 이미지 Overlay
- 카메라 권한 요청
- 가장 단순한 AR 경험

### 문제점
- UI 없음
- 사용자가 무엇을 해야 하는지 모름
- 갑자기 이미지가 나타남
- 작품성이 거의 없음

---

# v0.2 — User Experience Design

## 목표

AR을 단순 기술 시연이 아닌 **'기억을 복원하는 과정'** 으로 바꾸기.

### 구현
- 안내 문구 추가
- 사각형 Guide 추가
- Loading UI 제작
- Blur 애니메이션
- AI 복원 연출

### 개선
기술 데모에서 하나의 경험으로 발전.

### 문제점
- 인식 실패 안내 부족
- UI가 투박함
- 버튼이 갑자기 등장

---

# v0.3 — Archive System

## 목표

관람객도 작품의 일부가 되도록 만들기.

### 구현
- 기억 남기기
- Textarea
- 80자 제한
- Flash 효과
- Archive 화면
- Firebase 연결

### 성과
관람객의 기억을 Database에 저장하는 첫 번째 버전 완성.

### 문제점
- 저장 후 끝남
- 다른 사람과 연결되지 않음

---

# v0.3.3

## UI 개선

- Typography 수정
- Spacing 수정
- Animation 개선
- Fade 개선

---

# v0.3.5

## Animation 개선

- Blur 자연스럽게 변경
- Ease Out 적용
- Memory Button 등장 개선

---

# v0.3.7

## Firebase 안정화

- 저장 오류 수정
- Count 정상 출력
- Firebase 모듈 분리

---

# v0.3.8

## Archive 구조 개선

Firebase 데이터 구조 변경

```
memory
createdAt
random
project
archive
language
version
```

랜덤 필드(random) 추가.

---

# v0.3.9

# First Stable Build

가장 안정적인 버전.

### 특징

- 인식 안정
- Firebase 안정
- Animation 안정
- UI 안정

이후 문제가 생기면 항상 이 버전으로 롤백하는 기준 버전이 됨.

실제로 개발 과정에서 여러 차례 이 버전으로 복귀하며 안정성을 확보.

---

# v0.4 Beta

# Biggest Update

## Anonymous Memory

기존

```
기억 저장
↓

끝
```

↓

새 구조

```
기억 저장
↓

감사합니다

↓

다른 기억 보기

↓

다른 사람이 남긴 기억
```

프로젝트가

**'혼자 남기는 기록'**

에서

**'타인의 기억을 만나는 Archive'**

로 발전.

---

## Firebase

### Random Memory

```
getRandomMemory()
```

구현.

랜덤 출력 성공.

---

## UI

기존

```
감사합니다

버튼

기억
```

↓

새로운 구조

```
감사합니다

↓

다른 기억 보기

↓

Anonymous Memory Viewer

↓

새로운 기억 만나기
```

UX 전면 개선.

---

## Viewer

새로운 페이지 제작.

구성

```
REM404 ARCHIVE

↓

ANONYMOUS MEMORY

↓

큰 글씨

↓

새로운 기억 만나기
```

---

## Animation

- Viewer 전환
- Fade Animation
- Random Loading

추가.

---

# 실패 기록

## Reflection UI 추가

↓

인식률 저하

↓

삭제

---

## Target Lost 개선

↓

AR 인식 실패

↓

롤백

---

## GitHub Deploy 실패

GitHub Pages

```
Deployment failed
Try again later
```

수차례 발생.

원인

GitHub Pages 서버.

코드 문제 아님.

---

## Anonymous Memory

기존

한 페이지 안에

```
감사합니다

↓

기억

↓

버튼
```

↓

UX 최악.

↓

새 페이지 분리.

---

## CSS 대규모 수정

Anonymous Viewer 제작.

기존 CSS는 최대한 유지하면서
추가만 진행.

---

## archive.js 수정

기존 기능 유지.

새 Viewer만 연결.

기능 손상 없이 구현.

---

## GitHub Rollback

개발 도중

```
v0.3.9

↓

v0.4

↓

v0.3.9

↓

v0.4
```

수차례 반복.

이후 Release 관리 시작.

---

# v0.4 Stable

# First Stable Release

## 구현 완료

- ✅ MindAR
- ✅ Firebase
- ✅ AI Overlay
- ✅ Memory Archive
- ✅ Random Memory
- ✅ Count
- ✅ Archive UI
- ✅ Memory Viewer
- ✅ Random Viewer
- ✅ UI 개선
- ✅ Mobile UX

---

## 프로젝트 방향성 확립

초기

```
AR 사진
```

↓

중기

```
기억 남기기
```

↓

현재

```
AR

↓

기억 남기기

↓

다른 사람의 기억

↓

또 다른 기억
```

'기억의 순환 구조' 완성.

---

# 예정

# v0.4.1

## UX Patch

### Priority 1

### Camera Session 유지

사이트를 떠나기 전까지

카메라 유지.

권한 재요청 제거.

---

### Priority 2

Recognition UX

Target Lost 경험 개선.

불필요한 재인식 제거.

---

### Priority 3

Anonymous Memory Viewer 개선

- 글씨 크기
- 줄간격
- 여백
- 긴 문장 처리
- 시선 흐름 개선

---

### Priority 4

Camera Permission Test

- Safari
- Chrome
- Android

권한 유지 확인.

---

### Priority 5

Haptic 개선

- Android 테스트
- iOS 테스트
- 브라우저 지원 확인
- Fallback 구현

---

# Future Roadmap

## v0.5

- 관리자 기능
- 코드 리팩토링
- 전시 최적화

---

## v0.6

- 실제 전시장 테스트
- 조명 환경 테스트
- 관람객 테스트

---

## v1.0

# REM404 Archive Exhibition Release

---

# Development Retrospective

이번 개발에서 가장 의미 있었던 변화는 기능을 늘린 것보다 **프로젝트를 관리하는 방식이 성숙해진 점**이었다.

처음에는 기능을 빠르게 추가하는 데 집중했지만, 개발을 진행하며 여러 차례 인식 오류와 배포 문제를 겪었다.

그 과정에서 **v0.3.9를 안정판으로 유지하고, 문제가 생기면 즉시 롤백한 뒤 다시 개선하는 방식**을 정착시켰다.

또한 GitHub Release와 버전 관리를 도입해 기능 개발과 안정화를 분리하는 개발 흐름을 만들었다.

REM404는 이제 단순한 AR 기술 시연이 아니라,

> **한 사람이 남긴 기억이 또 다른 사람의 기억으로 이어지는 디지털 아카이브**

라는 명확한 작품 구조를 갖춘 프로젝트로 발전했다.

이 방향성은 앞으로의 졸업작품과 전시에서도 프로젝트의 핵심 축이 될 것이다.
