---
title: TS Basic Type
---

## 기본타입

```ts
// 기본타입

// 블리언
let isDone: boolean = false;

// 숫자 - 부동 소수값 (2,8,10,16진수 다 지원)
let decimal: number = 6; // 10진수
let hex: number = 0xf00d; // 16진수 > 61453
let binary: number = 0b1010; //2진수
let octal: number = 0o744; // 8진수

// ----------------------------------------

// 배열 Array
let list: number[] = [1, 2, 3]; // 프리미티브타입 + []
let list2: Array<number> = [1, 2, 3]; // 제네릭 + 배열

// 튜플 Tuple
let t1: [string, number];
// 초기화
t1 = ["hello", 10]; // 성공
// 잘못된 초기화
// t1 = [10, "hello"]; // 오류

// console.log(t1[0].substring(1)); // 성공 ello
// console.log(t1[1].toFixed(10)); //  10.0000000000
// console.log(t1[1].substring(1)); // 오류, 'number'에는 'substring' 이 없습니다.

// 열거 ( Enum )
enum Color1 {
  Red, // 기본적으로 0 부터 시작
  Green, //  1
  Blue, //  2
}
let c1: Color1 = Color1.Green;

// 자동으로 1 씩 증가
enum Color2 {
  Red = 1, // 1
  Green, // 2
  Blue, // 3
}
let c2: Color2 = Color2.Green;

// enum 하나하나 지정
enum Color3 {
  Red = 1,
  Green = 2,
  Blue,
}
let c3: Color3 = Color3.Green;

let colorNum: number = Color3.Green; // .Green 사실 2이다.
// console.log(colorNum);      // 2
let colorName: string = Color3[1]; // 1번째가 아니다!, 1의값을 가진것은 Red이다.
// console.log(colorName); // Red

// ----------------------------------------
// # Any  // # Void // # Null and Undefined

let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // 성공, 분명히 부울입니다.

let notSure2: any = 4;
console.log(notSure2.toFixed()); // 성공, 4 ,  toFixed는 존재합니다. (하지만 컴파일러는 검사하지 않음)
console.log(notSure2.ifItExists()); // 성공, ifItExists 는 런타임엔 존재할 것입니다. - 지금은 오류 TypeError: notSure2.ifItExists is not a function

// Object는 any와 다르게 호출이 불가능하다.
let prettySure: Object = 4;
// prettySure.toFixed(); // 오류: 프로퍼티 'toFixed'는 'Object'에 존재하지 않습니다.

let list3: any[] = [1, true, "free"];
list3[1] = 100;

// any의 반대 타입니다. 존재할 수 없다. 함수의 반환값이 없을때
function warnUser(): void {
  console.log("This is my warning message");
}

// void 형은 undefined 또는 null 만 할당 가능 - 쓸필요없다
let unusable: void = undefined;
// unusable = null; // 성공  `--strictNullChecks` 을 사용하지 않을때만

// 이 밖에 이 변수들에 할당할 수 있는 값이 없습니다!
let u: undefined = undefined;
let n: null = null;

// # Never
// 무조건 중간에 멈추는 경우의 타입

// never를 반환하는 함수는 함수의 마지막에 도달할 수 없다.
function error(message: string): never {
  throw new Error(message);
}

// 반환 타입이 never로 추론된다.
function fail() {
  return error("Something failed");
}

// never를 반환하는 함수는 함수의 마지막에 도달할 수 없다.
function infiniteLoop(): never {
  while (true) {}
}

// # Object 타입
// object는 원시 타입이 아닌 타입을 나타냅니다.
//  예를 들어, number, string, boolean, bigint, symbol, null, 또는 undefined 가 아닌 나머지를 의미합니다.
declare function create(o: object | null): void;

create({ prop: 0 }); // 성공
create(null); // 성공

// create(42); // 오류
// create("string"); // 오류
// create(false); // 오류
// create(undefined); // 오류

// #타입 단언 (Type assertions)
// 형변환이다, 런타임에 영향X 오로지 컴파일러한테 알려줌

let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length; // angle-bracket" 1. (any) => (string)

let someValue2: any = "this is a string";
let strLength2: number = (someValue2 as string).length; // as 2. (any) => (string)
```

## 참조

[https://typescript-kr.github.io/pages/interfaces.html](https://typescript-kr.github.io/pages/interfaces.html)
