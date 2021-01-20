---
title: NestJS Auth decorator
---

## 목적 - JWT 토큰을 처리하는 미들웨어 제작

1. Jwt 서비스 제작 : sign, verify 두 기능
2. Jwt 미들웨어 제작 : req['user'] 에 정보를 넣어줌 ( 2가지 방법 - express 직접 넣기, nestjs에 넣기 )
3. Auth Guard 를 제작 :
   사용자의 접근 권한을 true/false로 리턴 ( 위 req 에 user 정보에 따라 API 접근 여부 판단 ) ( 2가지 방법 - .., meta date 이용 )
4. **Auth decorator 를 제작 : 데코레이터를 통해 user 정보를 리턴 ( 위 req에 user 정보를 데코레이터로 제공 )**

# Pre

```ts
GraphQLModule.forRoot({
      autoSchemaFile: true,//join(process.cwd(), 'src/schema.gql'),
      context:({req})=> ({user:req['user']})
    }),
```

# @Context 대신에 … ParamDecorator

- Req['user'] 데이터 가져오는 두가지 방법

1. @Context 를 요청해서 , req를 가져온뒤 user를 찾기
2. @AuthUser( ) 라는 데코레이터 만들어서 1번의 과정 넣어두기

Graphql context에서 user를 찾는과정을 데코레이터로 만들 수 있다.

- createParamDecorator : Context에서 특정 데이터 가져오기 ( Query,Param,Body도 마찬가지 맥락 ?! )

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";

export const AuthUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext["user"];
    return user;
  }
);
```

```ts
    @UseGuards(AuthGuard) // 해당 요청은 가드되어지고 있다. - req.user가 없으면 forbidden
    @Query(returns =>User)
    me(@AuthUser() authUser:User , @Context() context){
        // console.log("context",context.user);
        // return context['user']
        return authUser;
    }
```
