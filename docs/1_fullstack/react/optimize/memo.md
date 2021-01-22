---
title: React Optimize - React.memo
---

## React.memo
https://www.youtube.com/watch?v=o-alRbk_zP0

### 1. 

문제: 🚀 부모가 리랜더링 되면 (textinput의변화) 자식도 랜더링 된다.  
해결:  ✅ 자식컴포넌트를 React.memo 로 감싸기  

### 2.

자식컴포넌트에 상수를 넘겨주면 리랜더링 안됨. 하지만,  
문제:  🚀 자식 컴포넌트한테 화살표 함수 props를 주는 경우, 또 리랜더링 문제가 발생
해결:  ✅ props의 화살표함수는 매번 만들어지므로 리랜더링 트리거가 된다  
그래서 그 화살표 함수를 useCallback으로 빼자.

### 3.

문제: 🚀 자식 컴포넌트한테 object를 props로 주는 경우, 또 리랜더링    
 컴포넌트 안의 하드코딩된 객체의 참조가 바뀌어서 그렇다.

해결 1:  ✅ useMemo에서 값을 하나하나 비교해서 결정 (obj 1 depth 진입)
해결 2:  ✅ props 의 object를 useMemo 로 감싼다.
해결 3:  ✅ props 의 object를 컴포넌트 함수 밖으로 뺀다.

// const data = { isEven: false };

### 최종 완성 모습 
- ( 자식 props에 전달하는 타입 유형에 따라서 최적화가 된 상황 )  

```ts
import React, { useCallback, useMemo, useState } from "react";
import Counter from "./counter";

const Opti01 = () => {
  const [text, setText] = useState("");
  const onFive = useCallback(() => setText("FIVE!!"), [setText]);
  // const data = { isEven: false };
  const data = React.useMemo(() => {
    return { isEven: false };
  }, []);
  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="text1"
        type="text"
      ></input>
      <Counter ment="hello" onFive={onFive} data={data} />
    </div>
  );
};
export default Opti01;


import React, { useRef, useState } from "react";
interface ICounter {
  ment?: string;
  onFive?: Function;
  data?: { isEven: boolean };
}
// ✔ 랜더링 횟수를 알아보기 위해 ref를 사용
const Counter: React.FC<ICounter> = React.memo(
  ({ ment, onFive, data }) => {
    const render = useRef(0);
    const [count, setCount] = useState<number>(0);
    return (
      <div>
        <div>ment : [ {ment} ] </div>
        <div>count : {count}</div>
        <div>render : {render.current++}</div>
        <button
          onClick={() => {
            if (count + 1 === 5 && onFive) {
              onFive();
            }
            setCount((prev) => prev + 1);
          }}
        >
          PLUS
        </button>
      </div>
    );
  }
  //   (preProps, nextProps) => {
  //     return preProps.data?.isEven === nextProps.data?.isEven;
  //   }
);
export default Counter;

```