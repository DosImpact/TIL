---
title: NestJS Auth Guard
---

## 목적 - JWT 토큰을 처리하는 미들웨어 제작

1. Jwt 서비스 제작 : sign, verify 두 기능
2. Jwt 미들웨어 제작 : req['user'] 에 정보를 넣어줌 ( 2가지 방법 - express 직접 넣기, nestjs에 넣기 )
3. **Auth Guard 를 제작 :**
   사용자의 접근 권한을 true/false로 리턴 ( 위 req 에 user 정보에 따라 API 접근 여부 판단 ) ( 2가지 방법 - .., meta date 이용 )
4. Auth decorator 를 제작 : 데코레이터를 통해 user 정보를 리턴 ( 위 req에 user 정보를 데코레이터로 제공 )

# 1 useGuards

    1. 가드 작성
    2. userGuard 사용

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext["user"];
    console.log("user", user);
    if (!user) {
      return false;
    }
    return true;
  }
}
```

```ts
import { AuthGuard } from "../auth/auth.guard";

@Resolver((of) => User)
export class UsersResolver {
  @UseGuards(AuthGuard)
  @Query((returns) => User)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }
}
```

# 2 setMetaData

주의 : UseGuard를 사용하면 SetMetaData가 작동한다. ( 반드시 제거 )

- 제작

1. Auth 모듈 provider를 미리 정의된 상수로 제공
2. 그러면 Reflector를 주입 받는다.
3. 그리기 위해 app 모듈에 auth 모듈 장착

```ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
@Module({
  providers: [
    {
      provide: APP_GUARD, // nestjs에서 제공하는 constants 이다. APP_GUARD가 provide되는곳에 다 사용 가능
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {

constructor(private readonly reflector: Reflector) {}

canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    console.log('user', user);

console.log('reflector', this.reflector.get('key', context.getHandler()));

if (!user) {
      return false;
    }
    return true;
  }
}

@Module({
  imports: [
…
AuthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.POST,
    });
  }
}
```

    - 사용

```ts
@SetMetadata('key', 'nanana')
  @Query(returns => User)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }
```

# 3 setMetaData More

1.  UserRole enum과 통합 - metaData의 value로 사용한다.

```ts
import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";
// UserRole는 enum이고 keyof + typeof 로 enum에 지정된 string을 가져올 수 있다.
export type AllowRoles = keyof typeof UserRole | "Any";
export const Role = (roles: AllowRoles[]) => SetMetadata("roles", roles);
```

    2. 새로운 MetaData 장착

```ts
@Role(['Any'])
  @Query(returns => User)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }
```

    3. 사용

```ts
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { AllowRoles } from "./role.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowRoles>("roles", context.getHandler());
    console.log(roles); // Authentication
    if (!roles) {
      return true; // Authentication - no needed
    } else {
      const gqlContext = GqlExecutionContext.create(context).getContext();
      const user: User = gqlContext["user"];
      if (!user) {
        return false; // Authentication - ❌
      } // Authentication - ✅
      if (user) {
        console.log(user); // Authorization
        if (roles.includes("Any")) {
          return true;
        }
        return roles.includes(user.role);
      }
    }
  }
}
```
