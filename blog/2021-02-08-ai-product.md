---
slug: AI 시스템의 요구사항과 기술의 방향
title: AI 시스템의 요구사항과 기술의 방향
author: Kim Do Young
author_title: dosimpact
author_url: https://github.com/DosImpact/TIL
author_image_url: https://avatars0.githubusercontent.com/u/55613273?s=460&u=0b72dd7b4a2e89a3da8a4917644f3de24d8af0b1&v=4
tags: ["AI", "blog", "react", "github"]
---

### AI Production Roadmap - AI 시스템의 요구사항과 기술의 방향

https://www.youtube.com/watch?v=ZfLdURY0qCs

모델 학습  
모델 파일이 나오면 , 모델 파일을 베포  
모델을 서빙을 해주는 서빙 , API로 모델 처리 등

- 1. 온라인 서빙 - 1초 이내 처리해야하므로, 비싼 머신, 높은 엔지니어링 요구
- 2. 오프라인 서빙

1,2,3,4… n번째 모델 업그레이드 모델 버전 관리

모델과 모델의 성능을 비교하려면, 여러 지표가 있다.  
Loss fucn 에 대한 대쉬 보드 필요  
모델 검증에 대한 unit test가 필요하다.

매일매일 데이터가 들어온다.

- 데이터에 대한 기본적인 검증 vaildation 필요
- 머신러닝쪽에서는 데이터의 버그가 결과로 버그발생 까지는 오래 걸린다.
- 데이터 검증은 그래서 반드시 unit test필요
- 데이터 부족은 , 데이터 라벨링 하는 작업을 해야한다.
- 모델이 취약한 방향으로 액티브 러닝을 해야한다.

### AI 비즈니스

https://www.youtube.com/watch?v=7Et4nF1DvBM

AI는 무조건 이길수밖에 없는 기술이다.
모든 비즈니스 측면에서 혁명이 일어날 것이다.
아직은 AI 비즈니스 모델로 성과를 보여주는 case가 많이 없다는점

AI 측면에서의 성과  
1.Cost Performance  
2.Customer Performance  
3.Revenue Performance

1.Cost Performance

- 비용을 줄여서 이익률을 높이는 것이다.
- Eg)고객 전화응대를 자연어 처리로 하는것이다.
  자연어 처리, 이상 탐지 , 수요 예측

  2.Customer Performance - 고객에게 많은 가치를 제공 - Youtube의 고도화된 추천 시스템

  3.Revenue Performance - 수익 퍼포먼스 최적화 - 마케팅 최적화 , 어느쪽에 마케팅 캠페인을 진행하면 최고의 효과인지
