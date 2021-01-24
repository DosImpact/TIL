---
title: DOM Event 버블링,캡쳐링,위임
---

# 순서

1. JS 이벤트 동작의 이해

- 상위 요소에 click 리스너는 하위요소한테도 적용된다.
- 이벤트 버블링 & 캡처링

2. JS 코드

- JS 단에서 구분하기 위한 - e.target vs e.currentTarget

3. CSS 코드

- 그럼 하위 요소에서 원치않는 버블링을 막기위해 ?
- pointer-events:none

# 1 JS 이벤트 동작의 이해

### 이벤트 등록

자바스크립트에서는 이벤트 리스너를 통해 사용자의 특정 동작과 그 특정 동작이 발생했을 때 발생시킬 이벤트를 함수로 표현한다.

```js
window.onload = function () {
  alert("Hello World");
};

var div = document.querySelector("div");
div.addEventListener("click", function () {
  console.log("hi");
});
```

위 함수는 div가 클릭되었을 때 콘솔창에 “hi”를 입력시킨다.

### 이벤트 버블링 & 캡쳐링

- 이벤트 버블링이란  
   어떤 이벤트가 발생되었을 때 해당 이벤트가 발생된 요소의 부모 요소를 통하여 최상위 요소까지 이벤트가 전달되는 현상을 말한다.
  ( bottom - up ) ( 기본 셋팅 ) e.target ( 정확하게 발생지를 알 수 있다. ) e.currnetTarget ( 리스너가 걸린 원천 노드를 뜻한다. )
- 이벤트 캡쳐링은  
  이와 완전히 반대로 가장 상위 요소로부터 이벤트 객체를 찾아가는 현상을 말한다. 다음 현상을 확인하기 위해서는 addEventListener 안에 capture: true를 넣으면 된다. (default는 false이다.)
  ( top - down )

### 이벤트 위임

이벤트 버블링과 이벤트 캡쳐링이란 특성을 적절히 사용하면 여러개의 요소가 있을 때 각각의 요소에 이벤트를 일일히 지정할 필요 없이 부모 요소에 이벤트를 하나만 주어 코드의 재사용성을 높이고 메모리를 절약할 수 있다.

```js
<ul id="parent-list">
    <li id="1">Item 1</li>
    <li id="2">Item 2</li>
    <li id="3">Item 3</li>
    <li id="4">Item 4</li>
    <li id="5">Item 5</li>
    <li id="6">Item 6</li>
</ul>

<script>
document.getElementById("parent-list").addEventListener("click", function(e) {
    if(e.target && e.target.nodeName == "LI") {
        console.log(e.target.id);
    }
});
</script>
```

위 코드의 동작을 확인하면 해당 item을 클릭했을 때 그 item의 id 값을 반환한다.  
그러나 script 코드를 보면 이벤트는 각 item이 아닌 그 item들을 감싸고 있는 parent-list에 준 것을 확인할 수 있다.

### 이벤트 객체

이벤트 객체란 이벤트가 일어나는 요소 그 자체를 의미한다. 앞서 본 코드에서 addEventListener("click", function(e) 부분에서 e.target 이 바로 이벤트 객체를 나타낸다.

그런데 자바스크립트 이벤트 코드를 뜯어보면 어떤 사람은 event.target을 또 어떤 사람은 event.currentTarget을 사용하는 것을 볼 수 있을 것이다.

이 둘에는 차이가 있는데 event.currentTarget은 이벤트가 걸려있는 위치를 반환(this가 가리키는 것과 같다.)  
하고 event.target은 실제 이벤트가 발생하는 위치, 내가 클릭한 요소를 반환한다.  
두 객체가 같을 수도 있지만 이벤트 위임을 통해 이벤트를 주었다면 두 개는 다른 값을 가질 것이다.  
이벤트 위임에서 예시로 든 코드를 예로 들면 event.currentTarget은 parent-list이고 event.target은 그 아래 list들에 해당할 것이다.

## 2. JS 코드 eg)

✅ querySelector 결과 id, classList.toggle, name, value 등의 요소가 있는
DOM Element 를 본다.

✅ 이와 마찬가지결과를 e.target 과 e.currentTarget 은 리턴한다.
이벤트 객체 e의 target 과 currentTarget이 DOM Element 이다.

✅ e.taget 과 e.currentTarget 을 구분하여, classList.toggle 을 주로 사용하는 코드이다.

```js
$(function () {
  // 객체 래퍼런스
  const CLASS_INVISIBLE = "displayNone";
  const productsFilterC = document.querySelector("#productsFilterC");
  const filterApplySumit = document.querySelector("#filterApplySumit");
  const filterItem_category = document.querySelector("#filterItem_category");
  const filterItem_brand = document.querySelector("#filterItem_brand");
  const filterItem_state = document.querySelector("#filterItem_state");
  const filterItem_color = document.querySelector("#filterItem_color");
  const mainFilterList = document.querySelector("#mainFilterList");
  const categoryFilterList = document.querySelector("#categoryFilterList");
  const brandFilterList = document.querySelector("#brandFilterList");
  const stateFilterList = document.querySelector("#stateFilterList");
  const colorFilterList = document.querySelector("#colorFilterList");
  let nowPlaceId = "mainFilterList";

  // filter click to detail
  // id를 에 일치하는 List를 display:none toggle
  const handle_clickToDetail = (id) => {
    console.log("handle_clickToDetail  ", id);
    if (!id) {
      return;
    }
    mainFilterList.classList.toggle(CLASS_INVISIBLE);
    switch (id) {
      case "filterItem_category":
        console.log("filterItem_category");
        categoryFilterList.classList.toggle(CLASS_INVISIBLE);
        nowPlaceId = id;
        break;
      case "filterItem_brand":
        brandFilterList.classList.toggle(CLASS_INVISIBLE);
        nowPlaceId = id;
        break;
      case "filterItem_state":
        stateFilterList.classList.toggle(CLASS_INVISIBLE);
        nowPlaceId = id;
        break;
      case "filterItem_color":
        colorFilterList.classList.toggle(CLASS_INVISIBLE);
        nowPlaceId = id;
        break;
      default:
        break;
    }
  }; // filter click to back
  // 뒤로가기 버튼
  const handle_backBtn = () => {
    mainFilterList.classList.toggle(CLASS_INVISIBLE);
    switch (nowPlaceId) {
      case "filterItem_category":
        categoryFilterList.classList.toggle(CLASS_INVISIBLE);
        break;
      case "filterItem_brand":
        brandFilterList.classList.toggle(CLASS_INVISIBLE);
        break;
      case "filterItem_state":
        stateFilterList.classList.toggle(CLASS_INVISIBLE);
        break;
      case "filterItem_color":
        colorFilterList.classList.toggle(CLASS_INVISIBLE);
        break;
      default:
        break;
    }
    nowPlaceId = "mainFilterList";
  };
  // 클릭 이벤트 발생시, e.target에서 ( 발생지 ) e.taget.id 값으로 로직 처리

  // filter click to detail add event
  const init_clickToDetail = () => {
    if (!filterItem_category) {
      console.log("cannot find filterItem_category");
    } else {
      filterItem_category.addEventListener("click", (e) => {
        handle_clickToDetail(e.target.id);
      });
    }
    if (!filterItem_brand) {
      console.log("cannot find filterItem_brand");
    } else {
      filterItem_brand.addEventListener("click", (e) => {
        handle_clickToDetail(e.target.id);
      });
    }
    if (!filterItem_state) {
      console.log("cannot find filterItem_state");
    } else {
      filterItem_state.addEventListener("click", (e) => {
        handle_clickToDetail(e.target.id);
      });
    }
    if (!filterItem_color) {
      console.log("cannot find filterItem_color");
    } else {
      filterItem_color.addEventListener("click", (e) => {
        handle_clickToDetail(e.target.id);
      });
    } // check box event
    document
      .querySelector(".detailFilterScroll")
      .addEventListener("click", (e) => {
        if (e.target) {
          const checkIcon = e.target.querySelector(".filterContent");
          if (checkIcon) {
            checkIcon.classList.toggle(CLASS_INVISIBLE);
          }
        }
      });
    const backBtns = document.querySelectorAll(".backBtn");
    console.log("backBtns", backBtns);
    // 클릭 이벤트 발생시, e.currnetTarget에서 ( 원천지 ) classList.contains 으로 로직 처리
    Array.from(backBtns).map((backBtn) => {
      backBtn.addEventListener("click", (e) => {
        if (e.currentTarget) {
          console.log(e.currentTarget);
          console.log(e.currentTarget.classList);
          if (e.currentTarget.classList.contains("backBtn")) {
            handle_backBtn();
          }
        }
      });
    });
  };
  init_clickToDetail(); // filter close event - backdrop
  if (!productsFilterC) {
    console.error("cannot find productsFilterC");
  } else {
    const background = productsFilterC.querySelector(".background");
    if (!background) {
      console.log("cannot find background");
    }
    background.addEventListener("click", (e) => {
      if (e.target && e.target.id === "background") {
        filterButton.classList.toggle("filteropen");
        productsFilterC.classList.toggle(CLASS_INVISIBLE);
      }
    });
  } // filter close event - submit
  if (!filterApplySumit) {
    console.error("cannot find filterApplySumit");
  } else {
    filterApplySumit.addEventListener("click", (e) => {
      if (e.target && e.target.id === "filterApplySumit") {
        filterButton.classList.toggle("filteropen");
        productsFilterC.classList.toggle(CLASS_INVISIBLE);
      }
    });
  } // filter click state
  let filterOpen = false;
  const filterButton = document.querySelector("#filterButton");
  if (!filterButton) {
    console.error("cannot find filterButton");
  } else {
    filterButton.addEventListener("click", (e) => {
      filterOpen = !filterOpen;
      filterButton.classList.toggle("filteropen");
      productsFilterC.classList.toggle(CLASS_INVISIBLE);
    });
  }
});
```

## 3. css 코드 eg)

✅ 부모 요소에 click 이벤트 리스너를 걸어두면 하위 요소에도 이벤트가 위임된다.
✅ 이를 방지하고자하면 포인트 이벤트를 none으로 하자 css에서도 셋팅 가능

```js
img {
    pointer-events: none;
  }
```

## 래퍼런스

https://mber.tistory.com/7
https://github.com/series-eight/s8/commit/2f3a42cf90663d3c6eaa3a7d116c6ff34f4333c2
