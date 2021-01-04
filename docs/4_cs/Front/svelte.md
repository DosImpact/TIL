---
title: React 가상 DOM vs 스벨트 DOM
---

## React 가상 DOM vs 스벨트 DOM

돔 업데이트의 오버해드는 어디서 오는가? 아래와 같은 상황을 가정해보자.

### DOM Update

```cs
변화전
<div class="hello"> hello world </div>
변화후
<div class="hello"> hello everybody </div>
```

### DOM Update 과정

```cs
    1. Div 노드 엘리먼트 비교
    2. 속성 비교 ( Class 변화 했는지 ? )
    3. 엘리먼트 아래로 내려가서 비교 ( text가 변경 되었는지 ) - overhead 발생
```

### 스벨트의 DOM 과 VDOM 처리의 차이

- 스벨트가 생성하는 업데이트는 3번부분이다.
- 런타임에 작업을 수행하도록 기다리지 않고 빌드시 앱에서 변경될 수 있는 방법을 알고 있는 컴파일러다.
- 물론 리액트 훅은 불필요한 작업을 많이 줄여준다. ( 두배 이상 )
- 그럼에도 불필요한 작업이 많아지면 결국에 문제가 생길것이다.
- 스벨트는 이런 문제를 해결하기 위해 나온것이다.

## 요약

- 요약 : 스벨트는 변경될 부분을 미리 알고 있다. > 바로 DOM을 update
- 요약 : 리액트는 가상돔을 그려서, diff알고리즘으로 변경된 부분을 파악하고 > DOM update

## 참조

[https://svelte.dev/blog/virtual-dom-is-pure-overhead](https://svelte.dev/blog/virtual-dom-is-pure-overhead)
