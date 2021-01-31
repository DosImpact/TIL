```ts
// 📌 ---- 인터페이스

// 📌 ---- 소개

// TS 타입검사는 값의 형태를 본다. = 덕 타이핑(duck typing) or 구조적 서브타이핑 (structural subtyping)

// 📌 ---- Our First Interface)

// 함수는 label:string을 최소한 가지고 있는 오브젝트이어야 한다.
// Obj는 size도 가지고 있지만 함수내에서는 label만 사용한다.

function printLabel(labeledObj: { label: string }) {
  console.log(labeledObj.label);
}

let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj);

// 📌 ---- Optional Properties

interface SquareConfig {
  color?: string;
  width?: number;
}

// 색상은 옵셔널한 값이다. createSquare에서는 기본값을 white로 주기때문에
// 리턴값의 color는 무조건 있다.
// interface input  , interface output
function createSquare(config: SquareConfig): { color: string; area: number } {
  let newSquare = { color: "white", area: 100 };
  if (config.color) {
    newSquare.color = config.color;
  }
  if (config.width) {
    newSquare.area = config.width * config.width;
  }
  return newSquare;
}

let mySquare = createSquare({ color: "black" });

// 📌 ---- Readonly properties

// final 키워드, readonly 키워드 , 처음에 생성될떄만 수정가능

interface Point {
  readonly x: number;
  readonly y: number;
}

let p1: Point = { x: 10, y: 2 };
console.log(p1);
// p1.x = 1; // error TS2540: Cannot assign to 'x' because it is a read-only property.

// ✅ ReadonlyArray는 읽기전용 Array이다.
// ✅ 그래서 mutable한 number[] 타입으로 할당이 불가능
// ✅ 하지만 타입단언으로 이를 타입 오버라이드 가능

let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
// ro[0] = 12; // 오류!
// ro.push(5); // 오류!
// ro.length = 100; // 오류!

// a = ro; // 오류! error TS4104: The type 'readonly number[]' is 'readonly' and cannot be assigned to the mutable type 'number[]'.
a = ro as number[];
a[0] = 99;

// 📌 ---- readonly vs const

// 목적 : 처음 생성시만 값 할당
// 변수를 사용하려면 const
// 프로퍼티로 사용하려면 readonly

// 📌 ---- Excess Property Checks)

// 1. 타입 하위 호환성 : superSet 오브젝트는 subSet 인터페이스를 갖는 함수에 들어 간다.
// superSet의 모든 프로퍼티를 사용하진 못하지만 TS는 이를 허용 ( 관대 )
// 하지만 **객체 리터럴**은 오류를 일으킨다. 초과프로퍼티 검사가 수행된다. ( not 관대 )

// 2. 선택적 프로퍼티(option bags) : ? 문법으로 optional 표기

interface SquareConfig2 {
  color?: string;
  width?: number;
}

function createSquare3(config: SquareConfig2): { color: string; area: number } {
  return { area: 1, color: "white" };
}

//초과 프로퍼티 검사 (excess property checking)
// 리터럴이받는다. 이를 피하는 방법 - 1 다른객체할당, 2 as, 3 인덱서블 프로퍼티

// ❌ 오류 - 객체 리터럴로 넘기는 경우 실패
// let mySquare4 = createSquare3({ width: 100, color: "white", colour: "red" });

const mySqProps = { colour: "red", width: 100 }; // 객체 리터럴이 아닌경우
let mySquare3 = createSquare3(mySqProps); // ✅1 성공 - colour는 없고, color는 optional하니 없어도 된다.

// ✅2 성공 - 타입 단언으로 추가 프로퍼티를 객체리터럴임도 넘길 수 있다.
let mySquare5 = createSquare3({
  width: 100,
  color: "white",
  colour: "red",
} as SquareConfig);

// ✅3 성공 문자열 인덱스 서명 ( 인덱서블 프로터피 추가 )

interface SquareConfig4 {
  color?: string;
  width?: number;
  [propName: string]: any;
}
function createSquare4(config: SquareConfig4): { color: string; area: number } {
  return { area: 1, color: "white" };
}
createSquare4({ color: "black", colour: "red", prefix: "red" });

// 📌 ---- 함수 타입 (Function Types)

// 함수 인터페이스
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

// 인자 및 리턴값 명시
mySearch = function (src: string, sub: string): boolean {
  let result = src.search(sub);
  return result > -1;
};
// 인자 및 리턴값을 추론한다.
mySearch = function (src, sub) {
  return false;
};

// 📌 ---- 인덱서블 타입 (Indexable Types)

// 인덱서블 탑인은 string 과 number를 지원한다.
// eg) myArray[0] , myArray["name"]
// 마치 객체에 배열이나 딕셔너리처럼 데이터를 key value 값으로 넣는다.
// number 인덱싱도 string으로 반환되기 때문에
// 문자열 인덱싱에서 값읽기를 myArray["0"] 대신 myArray[0] 이라고 해도 된다.

interface StringIdxArray {
  [index: string]: number;
  //   arrayName?: string;
}
interface NumberIdxArray {
  arrayName?: string;
  [index: number]: string;
}

let myNumIndexArray: NumberIdxArray;
myNumIndexArray = ["Bob", "Fred"]; // [ 'Bob', 'Fred' ]
myNumIndexArray.arrayName = "myFriends";

let myStr: string;
myStr = myNumIndexArray[0];
console.log(myNumIndexArray, myStr); //[ 'Bob', 'Fred', arrayName: 'myFriends' ] Bob

let myStrIndexArray: StringIdxArray;
// myStrIndexArray = [1, 2];
// myStrIndexArray.arrayName = "myDogs";
```
