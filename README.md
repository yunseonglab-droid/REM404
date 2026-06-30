# UM Research Lab - WebAR Prototype A

## 목표

관객 스마트폰에서 웹사이트 접속 → 카메라 허용 → 전시장 원본 사진 인식 → 미리 만든 AI 이미지가 4초 동안 천천히 나타남.

## 폴더 구조

```txt
webar-prototype-a/
├── index.html
└── assets/
    ├── target.mind   ← 직접 만들어 넣어야 함
    └── ai.jpg        ← 네가 만든 AI 이미지
```

## 해야 할 일

### 1. `assets/ai.jpg` 넣기

네가 만든 AI 이미지를 `ai.jpg` 이름으로 바꿔서 `assets` 폴더에 넣기.

### 2. `assets/target.mind` 만들기

MindAR 이미지 타깃 컴파일러를 사용해서 원본 사진을 `.mind` 파일로 변환해야 함.

원본 사진 1장을 넣고 컴파일한 뒤, 결과물을 `target.mind`로 저장해서 `assets` 폴더에 넣으면 됨.

### 3. 비율 조정

`index.html` 안에서 이 부분을 찾기.

```html
<a-image
  id="aiOverlay"
  src="#aiImage"
  position="0 0 0.01"
  width="1"
  height="1"
  material="transparent: true; opacity: 0;">
</a-image>
```

- 정사각형 이미지: `width="1" height="1"`
- 가로 사진: `width="1.5" height="1"`
- 세로 사진: `width="1" height="1.5"`

원본 사진과 AI 이미지 비율은 반드시 같게 맞추는 게 좋음.

### 4. 로컬 테스트

그냥 파일 더블클릭으로는 카메라가 안 될 수 있음.

VS Code 사용 가능하면 `Live Server` 확장으로 테스트하거나, GitHub Pages에 올려서 HTTPS로 테스트하는 것을 추천.

### 5. GitHub Pages 배포

1. GitHub 새 저장소 만들기
2. 이 폴더의 파일 업로드
3. Settings → Pages
4. Branch를 `main`, Folder를 `/root`로 선택
5. 생성된 주소를 QR 코드로 변환

## 주의

- iPhone은 카메라 권한/HTTPS 조건이 까다로움.
- GitHub Pages처럼 HTTPS 주소에서 테스트해야 안정적임.
- 원본 사진이 너무 단조로우면 인식이 잘 안 됨.
- 반사 심한 인화지는 인식률을 떨어뜨림.
- 전시장 조명에서 반드시 테스트해야 함.

## Prototype A 성공 기준

- 휴대폰에서 웹 접속 성공
- 카메라 허용 성공
- 원본 사진 인식 성공
- AI 이미지가 4초 동안 서서히 나타남
