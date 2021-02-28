---
title: JS Hoisting
---

# 호이스팅

요약 : 함수선언식에서 , 변수의 선언과 할당이 분리되는 현상 - 변수의 선언이 함수의 상단으로 올라가고, 할당은 그 자리에서 일어난다.

```js
noDefine3();

// 1. 호이스팅은 var name = "ojava" 를
// 선언부 , var name 과 할당 name = "ojava" 을 분리하여
// 선언부를 위로 옮기는 방식이다.
function noDefine() {
  // 변수 선언 및 할당 이전에 호출 테스트
  console.log("not defined : " + name); // undefined
  var name = "ojava";
  // 변수 초기화 이후 값 확인
  console.log("defined : " + name); // ojava
}

// 2. 1번의 코드는 다음처럼 이해할 수 있다.
// 선언부는 상단으로 호이스팅 되고, 할당부분은 그 자리에 있음
function noDefine2() {
  var name;
  // 변수 선언 및 할당 이전에 호출 테스트
  console.log("not defined : " + name); // undefined
  name = "ojava";
  // 변수 초기화 이후 값 확인
  console.log("defined : " + name); // ojava
}

// 3. 선언없이 할당만 되있는 경우
// 최상단으로 호이스팅 되어, 할당 한다 = 전역변수처럼 사용하게 된다.
// 그래서 코드상으로 선언,할당이 없어도 name은 값이 들어 있다.
function noDefine3() {
  console.log("not defined : " + name); // ojava
  name = "ojava";
  console.log("defined : " + name); // ojava
}

// 4. 호이스팅은 함수 선언식 ( 함수를 변수로 다루지 않는 )에만 적용된다.
// 함수 선언식 (function declarations)
function getNames() {
  var name = $("input:text").val();
}
// 함수 표현식 (function expressions)
var checkAge = function () {
  if ($("#age").val() < 20) {
    alert("20세 이상만 신청 가능합니다.");
  }
};
```
