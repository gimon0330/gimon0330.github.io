---
layout: post
title: "임베딩 검색 최적화 노트 — Milvus 파라미터 스윕"
date: 2025-03-12
category: blog
tags: [Embeddings, Vector-DB, Milvus]
cover: /src/posts/blog/embedding-opt.jpg
---

이미지/텍스트 임베딩 혼합 검색에서 Milvus 파라미터를 스윕해 **지연시간–정확도 타협점**을 찾았다.

## 인덱스
- `HNSW`: M=16, efConstruction=200 근방이 가장 안정적
- `IVF_FLAT`: nlist 증가는 리콜 개선에 유의미하나 latency 증가

## 결론
- 콘테스트 환경 기준 **HNSW**가 우세  
- 쿼리 시 `ef`를 요청당 동적으로 조절하면 안정성↑
