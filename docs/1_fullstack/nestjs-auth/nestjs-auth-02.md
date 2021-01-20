---
title: NestJS MiddleWare
---

## 목적 - JWT 토큰을 처리하는 미들웨어 제작

1. Jwt 서비스 제작 : sign, verify 두 기능
2. **Jwt 미들웨어 제작 : req['user'] 에 정보를 넣어줌 ( 2가지 방법 - express 직접 넣기, nestjs에 넣기 )**
3. Auth Guard 를 제작 :  
   사용자의 접근 권한을 true/false로 리턴 ( 위 req 에 user 정보에 따라 API 접근 여부 판단 ) ( 2가지 방법 - .., meta date 이용 )
4. Auth decorator 를 제작 : 데코레이터를 통해 user 정보를 리턴 ( 위 req에 user 정보를 데코레이터로 제공 )

## Jwt 미들웨어 제작 목적 : req['user'] 에 정보를 넣어줌 ( 2가지 방법 - express 직접 넣기, nestjs에 넣기 )

# Eg) JWT 인증 미들웨어

- NestMiddleware 구현 후 App 모듈에 configure 설정
  https://docs.nestjs.com/middleware#middleware

- 1. NestMiddleware 을 구현하고 App모듈에서 컨슘 한다.
- 2. express.js 처럼 미들웨어를 만든다.

```ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

// 방법1. MiddlewareConsumer 에서 apply해서 사용
@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log(req.headers["banana"]);
    // console.log("JwtMiddleWare");
    if ("x-jwt" in req.headers) {
      const token = req.headers["x-jwt"];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
          // console.log(decoded['id']);
          const { user, ok } = await this.usersService.findById(decoded["id"]);
          if (ok) {
            req["user"] = user;
          } // console.log(user);
        }
      } catch (error) {}
    }
    next();
  }
}
// 방법2. 함수형태로 만들어서 미들웨어를 만들어도 된다.
// index.ts 에서 use로 사용!
export function JwtMiddleWareFunc(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log(req.headers);
  console.log("JwtMiddleWareFunc");
  next();
}
```

### 방법 1 적용 - 미들웨어 consumer 이용

```ts
export class AppModule  implements NestModule { 
  configure(consumer: MiddlewareConsumer){
    consumer.apply(JwtMiddleWare).forRoutes({
      // path:"/graphql",
      // method:RequestMethod.POST
      path:"*",
      method:RequestMethod.ALL
    })
  }
```

### 방법 2 적용 - express.js 방식

    - main.ts 에서 app.use에 미들웨어 함수 넣기 ( express 에서 했던 방법이랑 동일 )

```ts
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { JwtMiddleWareFunc } from "./jwt/jwt.middleware";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(JwtMiddleWareFunc);
  await app.listen(4000);
}
bootstrap();
```

# More) JWT 미들웨어 클래스에 UserService DI 하기

    - Jwt미들웨어는 하나의 서비스이다. 그리고 userService를 알기위해서는 users모듈이 이를 export 해야한다.

```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // , ConfigService // , JwtService
  ],
  providers: [UsersResolver, UsersService],
  exports: [UsersService], // jwt middleware에서 사용하기 위해 exports를 해준다.
})
export class UsersModule {}
```
