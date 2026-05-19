# gimon0330.github.io

개인 포트폴리오용 GitHub Pages 저장소.

## Stack

- GitHub Pages
- Jekyll
- HTML
- CSS
- Vanilla JavaScript
- JSON content rendering
- Pretendard webfont

## Main files

- `index.html`: Main page
- `projects.html`: Projects page
- `career.html`: Career timeline page
- `coursework.html`: Coursework page
- `projects.json`: Project data
- `career.json`: Career timeline data
- `assets/main.js`: JSON rendering, reveal animation, page transition
- `assets/site.css`: Base style
- `assets/nav-fix.css`: Navigation style
- `assets/page-title.css`: Page title underline
- `assets/link-icons.css`: Link icons
- `assets/home-motion.js`: Main page scroll motion

## Project images

Project cards automatically search images by slug.

```text
/assets/projects/{project-slug}.webp
/assets/projects/{project-slug}.jpg
/assets/projects/{project-slug}.png
/assets/projects/{project-slug}.jpeg
/assets/projects/{project-slug}.svg
```

Example:

```text
/assets/projects/gr-3d-relativity-simulator.jpg
/assets/projects/yolo-v5-road-hazard-detection.png
```

## Local check

```bash
bundle install
bundle exec jekyll serve
```

```bash
node tools/check-site.mjs
```
