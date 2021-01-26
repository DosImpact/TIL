---
title: react-hook-form Example
---

# eg) 1 - 로그인 폼 만들기

- Input에 name을 지정해 준다. 그리고 ref로 register설정
- watch
- errors
- handleSubmit

```ts
import React from "react";
import { useForm } from "react-hook-form";

// input tpes 정의
type Inputs = {
  name: string;
  password: string;
};

// 로그인 폼 작성
const FormExample01 = () => {
  const { register, errors, handleSubmit, watch } = useForm<Inputs>(); // watch log
  console.log(watch());
  return (
    <div>
            
      <form // submit 시 valid 함수 호출 후 true면 콜백넘김
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
      >
                {/* name 반드시 설정, register 및 애러 핸들링 */}
                <input
          type="text"
          placeholder="name"
          name="name"
          ref={register({ required: true })}
        ></input>
                {errors.name && <span>This field is required</span>}
                
        <input
          type="password"
          placeholder="password"
          name="password"
          ref={register({ required: true })}
        ></input>
                {/* errors 타입은 여러종류가 있다. 패턴,공란,중복 */}
                
        {errors.password?.type === "required" && (
          <span>This field is required</span>
        )}
                <button type="submit">submit</button>
              
      </form>
          
    </div>
  );
};
export default FormExample01;
```
