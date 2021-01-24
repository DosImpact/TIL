---
title: React custom hook - usePersistState
---

### 목적

- 기존의 useState를 localstorage로 저장하도록 wrapping 하자.
- useEffect로 변수의 변경이 감지되면 localstorage 저장
- 처음 새로고침시 useState 기본값으로 localstorage 불러오기

### 구현

https://dev.to/selbekk/persisting-your-react-state-in-9-lines-of-code-9go

- ⚠ 제네릭 입력 위치
- ⚠ 제너릭 입력시, arrow function은 리턴타입으로까지 입력타입 T 가 안이어지더라..?
- ⚠ 배열 , [ ] 로 리턴하면 type은 union으로 되는것 주의!
- ⚠ JSON.parse 입력은 무조건 string이어야함, 그래서 "null" 을 추가함.
- ⚠ useState가 매번 localstorage에서 값을 불러온다. 이를 최적화 하기위해 ( ) => 으로 초기화

```ts
import React from "react";
//@Params(initialState)
//@returns (state,setState)

export function usePersistState<T extends unknown>(
  key: string,
  initialState: unknown
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = React.useState<T>(
    () => JSON.parse(localStorage.getItem(key) || "null") || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]); //⚠ state number 이고 setState 는 React.Dispatch 이다. []으로 리턴하면 섞인다.
  return [state, setState];
}
```

### 사용예시) useContext-counter 에 추가

```ts
import React from "react";
import { usePersistState } from "./usePersistState";

// CREATE

interface ICounterContext {
  cnt: number;
  setCnt: Function;
}
export const CounterContext = React.createContext<ICounterContext>({
  cnt: 999,
  setCnt: () => {},
});

// STORE

const CounterContextProvider: React.FC = ({ children }) => {
  const [cnt2, setCnt2] = React.useState<number>(0);

  const [cnt, setCnt] = usePersistState<number>("cnt", 0);

  return (
    <CounterContext.Provider
      value={{
        cnt,
        setCnt,
      }}
    >
      {children}
    </CounterContext.Provider>
  );
};

export default CounterContextProvider;

// SOME .. GETTER

export const useCounterGetter = () => {
  const { cnt } = React.useContext(CounterContext);
  return { cnt };
};

// SOME .. SETTER

export const useCounterSetter = () => {
  const { setCnt } = React.useContext(CounterContext);
  return { setCnt };
};
```

```ts
import React from "react";
import CounterContextProvider from "./counter-context";
import CounterHandle from "./counter-handle";
import CouterView from "./counter-view";

const Context03 = () => {
  return (
    <CounterContextProvider>
      <h3>ROOT PROVIDER</h3>
      {/* <hr />
      <h3>CNT VIEWER</h3>
      <CouterView />
      <h3>CNT HANDLER</h3>
      <CounterHandle /> */}
      <hr />
      <h2>Ver2</h2>
      <h3>CNT VIEWER .Ver2</h3>
      <CouterView />
      <h3>CNT HANDLER .Ver2</h3>
      <CounterHandle />
    </CounterContextProvider>
  );
};

export default Context03;
```

```ts
import React from "react";
import { useCounterGetter } from "./counter-context";

const CouterView = () => {
  // const { cnt } = React.useContext(CounterContext);
  const { cnt } = useCounterGetter();

  return <div>counter : {cnt}</div>;
};

export default CouterView;


---
import React, { useContext } from "react";
import { CounterContext, useCounterSetter } from "./counter-context";

const CounterHandle = () => {
  // const { setCnt } = useContext(CounterContext);
  const { setCnt } = useCounterSetter();

  return (
    <div>
      <button
        onClick={() => {
          setCnt((p: number) => p + 1);
        }}
      >
        Add
      </button>
    </div>
  );
};

export default CounterHandle;

```

### 참조

https://dev.to/selbekk/persisting-your-react-state-in-9-lines-of-code-9go
