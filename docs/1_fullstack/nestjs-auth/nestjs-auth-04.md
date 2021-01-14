---
title: NestJS MiddleWare JWT
---

## 목적 - JWT 토큰을 처리하는 미들웨어 제작

1. Jwt 서비스 제작 : sign, verify 두 기능
2. Jwt 미들웨어 제작 : req['user'] 에 정보를 넣어줌 ( 2가지 방법 - express 직접 넣기, nestjs에 넣기 )
3. Auth Guard 를 제작 :
   사용자의 접근 권한을 true/false로 리턴 ( 위 req 에 user 정보에 따라 API 접근 여부 판단 ) ( 2가지 방법 - .., meta date 이용 )
4. **Auth decorator 를 제작 : 데코레이터를 통해 user 정보를 리턴 ( 위 req에 user 정보를 데코레이터로 제공 )**

## NestJS 는 물론 Passport 와 JWT 구현을 해 두었다.

    - https://docs.nestjs.com/techniques/authentication

## 하지만 직접 root 모듈을 만들어서 구현해보자.

메일 기능을 위한 모듈을 만들어야해서

## 모듈에는 두가지 종류가 있다.

- static 모듈 : 설정 없이 부착
- dynamic 모듈 : option으로 모듈을 생성 후 option으로 모듈이 정해지면 정적 모듈이 된다.
  NestJS 는 이러한 모듈을을 어디서든 불러올 수 있게 해준다 ( 이러한 방식의 설계 디자인패턴을 DI 라고도 한다. )

## 글로벌 모듈과 아닌 모듈

- Global 데코레이터를 이용해서 jwt커스텀 모듈을 글로벌로 만들 수 있다.
- isGlobal 옵션을 제공하는 config 을 주어서 선택권을 줄 수 있다. ( 옵션에따라 변하는 모듈이라 dynamic모듈이라고 한다.)
- 글로벌모듈은 User모듈에서 따로 import할 필요없다.

## 1. JWT 커스텀 모듈 제작

- 목적 : jwt토큰을 암호화,복호화 (jwt.sign,jwt.verify) 를 제공하는 서비스를 담고있는 커스텀 모듈 제작
- jwt.module.ts 제작

```ts
// 모듈 option interface
export interface JwtModuleOptions {
  privateKey: string;
}
// @Inject key 값 정의
export const CONFIG_OPTIONS = "CONFIG_OPTIONS";

import { DynamicModule, Global, Module } from "@nestjs/common";
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { JwtModuleOptions } from "./jwt.interface";
import { JwtService } from "./jwt.service";

// global 데코레이터를 사용하면, user모듈에서 사용할때 import 없이 사용가능
// service에서 바로 사용 가능,   private readonly jwtService: JwtService
@Module({})
@Global()
export class JwtModule {
  // forRoot는 모듈을 리턴합니다. Dynamic모듈의 옵션을 정의합니다.
  static forRoot(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtModule,
      exports: [JwtService], // Service 로직 exports
      providers: [
        {
          provide: JwtService,
          useClass: JwtService, // provider의 class Type 선언
        },
        {
          provide: CONFIG_OPTIONS,
          useValue: options, // provider의 value Type 선언
        },
      ],
    };
  }
}
```

- app.module.ts 장착

```ts
@Module({
  imports: [
        ...
    JwtModule.forRoot({
      privateKey: process.env.SECRET_KEY,
    }),
        ......
  ],
  controllers: [],
  providers: [],
})
```

- users.service.ts 사용

```ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    // private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {
    // jwtService.hello()
  }
}
```
