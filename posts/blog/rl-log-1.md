---
layout: post
title: "RL 실험 로그 #1 — 멀티에이전트 셋업"
date: 2025-03-20
category: blog
tags: [RL, Multi-Agent, ELO]
cover: /src/posts/blog/rl-log-1.jpg
---

첫 로그. 멀티에이전트 환경을 최소 구성으로 올리고, 에이전트 간 **self-play**로 성능을 추정했다.

## 환경
- Gym 스타일 인터페이스
- 보상: 승리 +1, 패배 -1, 무승부 0
- 상태 표현: 원-핫 + 간단한 특징량

## 메모
- Elo 추정치가 초반엔 변동이 큼 → **평활화** 필요
- 랜덤 초기 정책이면, 탐색률을 충분히 높게 시작하는 편이 안정적
