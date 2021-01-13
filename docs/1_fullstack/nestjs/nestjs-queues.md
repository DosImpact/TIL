---
title: NestJS Techniques Queues
---

## 큐잉 시스템이란?

- 큐도입으로 스케일링과 퍼포먼스 이슈를 해결 할 수 있다.
- 리소스 집약적인 작업을 할 때 작업 요청을 대기열에 두고 처리가능
- node.js의 이벤트 루플르 블락킹할 작업을 다른 프로세스한테 맡길 수 있다.
- 예를들어 오디오 코딩 같은 CPU 집약적인 작업은 다른 CPU에 맡기고, 프로세스가 응답을 하도록 대기시킬 수 있다.
- 안정적인 커뮤니케이션 채널을 형성 가능, 한 서비스(프로세스)는 consumer, 다른 서비스(프로세스)는 Producer 역할 분담 가능

## Node.js 진영의 큐

- @nestjs/bull는 bull.js 에 대한 wrapper 다
- Bull은 Redis 기반으로 데이터를 유지한다.
- Redis가 설치되어있어야 한다.
- 플렛폼 독립적으로 실행가능
- 그 뜻은, 한 서버에서는 producers and consumers and listeners > 다른 네트워크의 서버는 consumers and listeners 분산처리 가능

## 참조

[techniques/queues](techniques/queues)
