---
title: React useContext
---

## 목적

- redux를 간단하게 대처할 방법이다.
- Provider를 제공해서 하위 모든 컴포넌트가 state를 공유할 수 있도록 한다.
- 간단한 state 관리는 Context가 좀 더 간단하고 더 함수형 프로그래밍에 가깝다.

## 예시 1 - counter

### eg 01 - counter

### version 1

- CounterContext 를 생성한다.
- CounterContextProvider 에서 변수를 셋팅한다.

```ts
import React from "react";

interface ICounterContext {
  cnt: number;
  setCnt: Function;
}

export const CounterContext = React.createContext<ICounterContext>({
  cnt: 0,
  setCnt: () => {},
});

const CounterContextProvider: React.FC = ({ children }) => {
  const [cnt, setCnt] = React.useState<number>(0);
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
```

- Provider 하위에 컴포넌트들이 변수를 공유하도록 만듦

```tsx
import React from "react";
import CounterContextProvider from "./counter-context";
import CounterHandle from "./counter-handle";
import CouterView from "./couter-view";
const Context01 = () => {
  return (
    <CounterContextProvider>
            <h3>ROOT PROVIDER</h3>
      <hr />
            <h3>CNT VIEWER</h3>
      <CouterView />
            <h3>CNT HANDLER</h3>
      <CounterHandle />
    </CounterContextProvider>
  );
};
export default Context01;
```

- CouterView :cnt 변수를 보여준다.

```ts
import React from "react";
import { CounterContext } from "./counter-context";
const CouterView = () => {
  const { cnt } = React.useContext(CounterContext);
  return <div>counter : {cnt}</div>;
};
export default CouterView;
```

- CounterHandle : cnt변수를 증가시킨다.

```tsx
import React, { useContext } from "react";
import { CounterContext } from "./counter-context";
const CounterHandle = () => {
  const { setCnt } = useContext(CounterContext);
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

### version2

- useContext 하는 부분을 hook으로 만들어보자.
- 바로 사용 가능한 함수를 만든다. 일종의 actionCreator에 대응하는 훅이다.

```tsx
import React from "react";
// CREATE
interface ICounterContext {
  cnt: number;
  setCnt: Function;
}
export const CounterContext = React.createContext<ICounterContext>({
  cnt: 0,
  setCnt: () => {},
});
// STORE
const CounterContextProvider: React.FC = ({ children }) => {
  const [cnt, setCnt] = React.useState<number>(0);
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
// SOME .. GETTER
export const useCounterGetter = () => {
  const { cnt } = React.useContext(CounterContext);
  return { cnt };
};
// SOME .. SETTER
export const useCounterSetter = () => {
  const { setCnt } = React.useContext(CounterContext);
  return { setCnt };
};
```

```ts
import React from "react";
import { useCounterGetter } from "./counter-context";
const CouterView = () => {
  // const { cnt } = React.useContext(CounterContext);
  const { cnt } = useCounterGetter();
  return <div>counter : {cnt}</div>;
};
export default CouterView;
```

## 예시 2 - todoList

### eg 02 todoList

- 위와 유사하게 todolist를 연습해 보자.
- 타이핑에 주의!

### todo-context.tsx

```tsx
import React from "react";
interface todoEl {
  title: string;
  isFin: boolean;
}
interface ITodoContext {
  owner: string;
  setOwner: Function;
  todoList: todoEl[]; // read
  pushTodoList: { (todoEl: todoEl): void }; // create
  deleteTodoList: { (title: string): void }; // U
  updateTodoList: { (number: number): void }; //D
}

export const TodoContext = React.createContext<ITodoContext>({
  owner: "no name",
  setOwner: () => {},
  todoList: [],
  pushTodoList: (e: todoEl) => {},
  deleteTodoList: (title: string) => {},
  updateTodoList: (number: number) => {},
});

const TodoContextProvider: React.FC = ({ children }) => {
  const [owner, setOwner] = React.useState<string>("no name");
  const [todoList, setTodoList] = React.useState<todoEl[]>([]);
  const pushTodoList = (e: todoEl) => {
    setTodoList((p) => {
      p.push(e);
      return [...p];
    });
  };
  const deleteTodoList = (title: string) => {
    const resIdx = todoList.findIndex((todo) => {
      return todo.title === title;
    });
    if (resIdx !== -1) {
      setTodoList((todo) => {
        todo.splice(resIdx, 1);
        return [...todo];
      });
    }
  };
  const updateTodoList = (number: number) => {
    if (number >= 0 && number < todoList.length) {
      setTodoList((todo) => {
        todo[number] = {
          ...todo[number],
          isFin: !todo[number].isFin,
        };
        return [...todo];
      });
    }
  }; // 출력 - getter, setter
  return (
    <TodoContext.Provider
      value={{
        owner,
        setOwner,
        todoList,
        pushTodoList,
        deleteTodoList,
        updateTodoList,
      }}
    >
            {children}
    </TodoContext.Provider>
  );
};
export default TodoContextProvider;
export const usePushTodo = () => {
  const { pushTodoList } = React.useContext(TodoContext);
  const [value, setValue] = React.useState<string>("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  const onSubmit = () => {
    pushTodoList({ isFin: false, title: value });
    setValue("");
  };
  return { value, onChange, onSubmit };
};
```

### context02.tsx

```tsx
import React from "react";
import TodoContextProvider from "./todo-context";
import TodoInputs from "./todo-inputs";
import TodoViewer from "./todo-viewer";
// useContext의 todo list 버전
// context.tsx 만들고
// provider 제공
// useConxt getter/setter 제공
const Context02 = () => {
  return (
    <TodoContextProvider>
            <h2>Todo Context Parents</h2>
            <h3>Todo Header</h3>
      <TodoInputs />
            <h3>Todo Viewer</h3>
      <TodoViewer />
    </TodoContextProvider>
  );
};
export default Context02;
```

### todo-inputs.tsx

```tsx
import React from "react";
import { TodoContext, usePushTodo } from "./todo-context";

const TodoInputs = () => {
  const { deleteTodoList, updateTodoList } = React.useContext(TodoContext);
  const PushTodo = usePushTodo();
  const [delValue, setDelValue] = React.useState("");
  const [updateValue, setUpdateValue] = React.useState("");
  return (
    <div>
      <h4>PushTodo</h4>
            <form
        onSubmit={(e) => {
          e.preventDefault();
          PushTodo.onSubmit();
        }}
      >
                
        <input
          type="text"
          value={PushTodo.value}
          onChange={PushTodo.onChange}
        ></input>
                <button>submit</button>
              
      </form>
            <h4>deleteTodoList</h4>
            <form
        onSubmit={(e) => {
          e.preventDefault();
          deleteTodoList(delValue);
          setDelValue("");
        }}
      >
                
        <input
          onChange={(e) => {
            setDelValue(e.target.value);
          }}
          value={delValue}
          type="text"
          placeholder="todo title"
        ></input>
                <button>del todo</button>
      </form>
            <h4>updateTodoList</h4>
            <form
        onSubmit={(e) => {
          e.preventDefault();
          updateTodoList(Number(updateValue));
          setUpdateValue("");
        }}
      >
        <input
          onChange={(e) => {
            setUpdateValue(e.target.value);
          }}
          value={updateValue}
          type="text"
          placeholder="todo num"
        ></input>
        <button>del todo</button>
      </form>
          
    </div>
  );
};
export default TodoInputs;
```

### todo-viewer.tsx

```tsx
import React from "react";
import { TodoContext } from "./todo-context";
const TodoViewer = () => {
  const { todoList } = React.useContext(TodoContext);
  return (
    <div>
        <pre>{JSON.stringify(todoList, null, 2)}</pre>
    </div>
  );
};
export default TodoViewer;
```

## More

### more ⚠ interface에 ( ) => 타입 지정

```ts
interface ITodoContext {
  owner: string;
  setOwner: Function;
  todoList: todoEl[]; // read
  pushTodoList: { (todoEl: todoEl): void }; // create
  deleteTodoList: { (title: string): void }; // U
  updateTodoList: { (number: number): void }; //D
}
```

### more ⚠ ( ) => 에 T 제너릭 지정

https://stackoverflow.com/questions/32308370/what-is-the-syntax-for-typescript-arrow-functions-with-generics
