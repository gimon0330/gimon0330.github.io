---
layout: post
title: "UWB 실내 측위 데모 회고"
date: 2025-02-28
category: blog
tags: [UWB, Localization, Demo]
cover: /src/posts/blog/uwb-demo-retro.jpg
---

UWB 태그–앵커 기반 **실내 측위** 데모. 예상보다 **NLOS 오차**가 컸다.

### 배운 점
- 코너/기둥에서 반사 경로가 길어짐 → **칼만/파티클 필터**로 완화
- 앵커 높이 일관화가 중요
- 실측 기준 RMSE 리포팅이 설득력↑

### 다음
- 가벼운 **맵-매칭** 추가
- 모바일 디바이스 센서퓨전 시도
