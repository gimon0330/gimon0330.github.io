# 안강현 Portfolio

개인 포트폴리오와 활동 아카이브를 관리하는 GitHub Pages 저장소입니다.

사이트 주소: <https://gimon0330.github.io>

## Overview

이 사이트는 POSTECH에서 Computer Science와 Mathematics를 복수전공하고 있는 안강현의 프로젝트, 경력, 수강 기록, 글을 정리하기 위한 정적 포트폴리오입니다.

현재 구조는 **GitHub Pages + Jekyll + static HTML/CSS/JavaScript** 기반입니다. React, Next.js, Vite 같은 별도 프론트엔드 빌드 도구를 사용하지 않고, GitHub Pages에서 바로 배포될 수 있도록 가볍게 구성되어 있습니다.

## Main Features

- 메인 Hero Section
- Education Section
  - 부산일과학고등학교
  - 포항공과대학교 POSTECH
- Featured Achievements
- Projects Preview
- Career / Experience Timeline
- Coursework Archive
- Posts Archive
- Project filtering
- Scroll reveal animation
- Page transition animation
- Pretendard webfont 적용
- 모바일 반응형 레이아웃

## Tech Stack

- GitHub Pages
- Jekyll
- HTML
- CSS
- Vanilla JavaScript
- JSON-based content rendering
- Pretendard Variable Webfont

## Repository Structure

```text
.
├── _config.yml
├── Gemfile
├── README.md
├── about.md
├── index.html
├── career.html
├── coursework.html
├── projects.html
├── projects.json
├── assets/
│   ├── site.css
│   ├── main.js
│   ├── font.css
│   └── logos/
│       ├── bsis.svg
│       └── postech.svg
├── posts/
│   ├── index.html
│   ├── blog/
│   │   ├── index.html
│   │   └── index.json
│   ├── bsis/
│   │   ├── index.html
│   │   └── index.json
│   ├── postech/
│   │   ├── index.html
│   │   └── index.json
│   └── lecture/
│       ├── index.html
│       └── index.json
└── tools/
    └── check-site.mjs
```

## Key Files

### `index.html`

메인 페이지입니다.

Hero Section, Education Section, Featured Achievements, Projects Preview가 포함되어 있습니다.

### `career.html`

전체 활동, 수상, 연구, 멘토링, 프로젝트 경험을 Timeline UI로 보여주는 페이지입니다.

Career 데이터는 현재 `assets/main.js` 내부의 `CAREER` 배열에서 렌더링됩니다.

### `coursework.html`

POSTECH 수강 기록을 정리하기 위한 Coursework Archive 페이지입니다.

### `projects.html`

프로젝트 전체 목록 페이지입니다.

`projects.json`을 기반으로 카드 UI를 렌더링하며, 기술 태그 기반 필터링을 지원합니다.

### `projects.json`

프로젝트 데이터 파일입니다.

예시 구조:

```json
{
  "title": "Project Title",
  "year": 2026,
  "featured": true,
  "summary": "Short project description",
  "tech": ["Next.js", "NestJS", "Supabase"],
  "links": {
    "github": "https://github.com/...",
    "overview": "https://...",
    "docs": "https://..."
  }
}
```

`featured: true`인 프로젝트는 메인 페이지의 Projects Preview에 표시됩니다.

### `assets/site.css`

전체 사이트의 디자인 시스템과 반응형 레이아웃을 담당합니다.

색상, 카드 UI, Hero Section, Timeline, Education Card, 버튼, 애니메이션 등이 이 파일에 정의되어 있습니다.

### `assets/main.js`

사이트의 동적 렌더링과 인터랙션을 담당합니다.

주요 기능:

- Featured Projects 렌더링
- Projects Page 렌더링
- Project tag filter
- Career Timeline 렌더링
- Scroll reveal animation
- Page transition animation
- Font stylesheet 자동 로드
- JSON 렌더링 시 HTML escaping 처리

### `assets/font.css`

Pretendard Variable 웹폰트를 정의합니다.

한글과 영문이 함께 자연스럽게 보이도록 `Pretendard Variable`을 기본 폰트로 사용하고, 시스템 폰트 fallback을 함께 지정합니다.

### `assets/logos/`

Education Section에서 사용하는 school image가 들어 있습니다.

현재 파일:

```text
assets/logos/bsis.svg
assets/logos/postech.svg
```

현재 이미지는 포트폴리오용 SVG 이미지입니다. 공식 로고 파일을 사용할 경우 같은 경로의 파일을 교체하면 됩니다.

## Editing Guide

### 메인 소개 문구 수정

`index.html`의 Hero Section에서 아래 부분을 수정하면 됩니다.

```html
<p class="hero-lead">POSTECH에서 Computer Science와 Mathematics를 복수전공하고 있는 AI Researcher입니다.</p>
```

### 프로젝트 추가

`projects.json`에 새 객체를 추가합니다.

```json
{
  "title": "New Project",
  "year": 2026,
  "featured": true,
  "summary": "프로젝트 설명",
  "tech": ["Python", "PyTorch", "AI"],
  "links": {
    "github": "https://github.com/..."
  }
}
```

메인 페이지에 노출하고 싶으면 `featured`를 `true`로 설정합니다.

### 프로젝트 이미지 추가

프로젝트 카드 이미지는 기본적으로 아래 경로를 찾습니다.

```text
/src/projects/{프로젝트 제목}.jpg
```

예를 들어 프로젝트 제목이 `CCDI Internship Platform`이면 다음 파일을 추가하면 됩니다.

```text
/src/projects/CCDI%20Internship%20Platform.jpg
```

또는 `projects.json`에서 `image` 필드를 직접 지정할 수 있습니다.

```json
{
  "image": "/src/projects/ccdi.jpg"
}
```

### Career Timeline 수정

`assets/main.js`의 `CAREER` 배열을 수정합니다.

```js
{
  date: "2026.2.22 ~ 2026.3.22",
  type: "Project",
  title: "사단법인 문화콘텐츠개발원",
  desc: "외국인 유학생 표준현장실습학기제 신청 플랫폼 개발 · ccdi.kr"
}
```

### 학교 이미지 교체

아래 파일을 교체하면 Education Section에 바로 반영됩니다.

```text
assets/logos/bsis.svg
assets/logos/postech.svg
```

PNG를 쓰고 싶다면 `index.html`의 이미지 경로도 함께 수정하면 됩니다.

## Local Check

게시글 목록 JSON과 실제 파일이 맞는지 확인하려면 다음 명령을 실행합니다.

```bash
node tools/check-site.mjs
```

이 스크립트는 `posts/*/index.json`에 들어 있는 로컬 URL이 실제 파일로 존재하는지 검사합니다.

## Local Development

GitHub Pages와 동일한 Jekyll 환경으로 확인하려면 Ruby와 Bundler가 필요합니다.

```bash
bundle install
bundle exec jekyll serve
```

그 후 브라우저에서 아래 주소를 엽니다.

```text
http://localhost:4000
```

단순 HTML/CSS/JS 수정만 확인할 때는 GitHub Pages 배포 후 직접 확인해도 됩니다.

## Deployment

이 저장소는 `gimon0330.github.io` user page 저장소이므로, `main` 브랜치에 push하면 GitHub Pages를 통해 자동 배포됩니다.

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

## Design Direction

- Clean portfolio layout
- Dark modern gradient background
- Card-based sections
- Mobile-first responsive UI
- Smooth scroll reveal
- Lightweight static deployment
- Minimal dependency footprint

## Notes

- 공식 학교 로고를 사용할 경우 각 기관의 로고 사용 가이드를 확인하는 것이 좋습니다.
- 현재 school image는 공식 로고가 아니라 포트폴리오용 SVG 이미지입니다.
- 외부 웹폰트는 CDN을 통해 불러오며, 실패 시 시스템 폰트로 fallback됩니다.
